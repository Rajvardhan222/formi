import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Define types for our data structures
interface FormElement {
  id: string;
  type: string;
  text?: string;
  label?: string;
  options?: Array<{
    id: string;
    label: string;
  }>;
}

interface FormData {
  formId: string;
  title?: string;
  elements: FormElement[];
  user_id: string;
}

interface ResponseItem {
  elementId: string;
  value: string | string[];
}

interface FormResponse {
  id: string;
  formId: string;
  response_data: ResponseItem[];
  created_at: string;
}

interface ProcessedAnswer {
  type: string;
  question: string;
  answer: string | string[] | null;
}

export const GET = async (
  req: Request,
  { params }: { params: { formId: string } }
) => {
  const { formId } =await params;
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!formId || formId.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Form ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // First get the form to verify ownership and to get the form structure
    const form = await db("forms")
      .where({
        formId: formId,
        user_id: userId
      })
      .first() as FormData | undefined;
      
    if (!form) {
      return new Response(JSON.stringify({ error: "Form not found or you don't have access" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all responses for this form
    const responses = await db("responses")
      .where("formId", formId)
      .select("*") as FormResponse[];
      
    const processedResponses = responses.map((response: FormResponse) => {
      const currentAnswer: Record<string, ProcessedAnswer> = {};
      
      // Make sure response_data exists and is an array
      if (!response.response_data || !Array.isArray(response.response_data)) {
        return { error: "Invalid response data format", raw: response };
      }
      
      response.response_data.forEach((ans: ResponseItem) => {
        if (!ans.elementId) return;
        
        const element = form.elements.find((el: FormElement) => el.id === ans.elementId);
        if (!element) return;
        
        // Store answers by element id to preserve all responses
        if (!currentAnswer[element.id]) {
          currentAnswer[element.id] = {
            type: element.type,
            question: element.text || element.label || "Unnamed Question",
            answer: null
          };
        }
        
        switch(element.type) {
          case "short_ans":
            currentAnswer[element.id].answer = ans.value as string;
            break;
            
          case "single_choice":
            // Find the selected option from the form structure
            const selectedOption = element.options?.find((opt) => opt.id === ans.value);
            currentAnswer[element.id].answer = selectedOption ? selectedOption.label : ans.value as string;
            break;
            
          case "multi_choice":
            // Map multiple selected options to their labels
             
            if (Array.isArray(ans.value)) {
              currentAnswer[element.id].answer = (ans.value as string[]).map((val: string) => {
                const option = element.options?.find((opt) => opt.id === val);
                return option ? option.label : val;
              });
            } else {
              currentAnswer[element.id].answer = ans.value as string;
            }
            break;
            
          default:
            currentAnswer[element.id].answer = ans.value as string;
        }
      });
      
      return {
        responseId: response.id,
        submittedAt: response.created_at,
        answers: Object.values(currentAnswer)
      };
    });

    return new Response(
      JSON.stringify({
        responses: processedResponses,
        totalResponses: processedResponses.length,
        formTitle: form.title || "Untitled Form",
       
        formId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch form responses" }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}