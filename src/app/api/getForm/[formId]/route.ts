import { Knex } from 'knex';
import { Forms } from "../../../../../db/src/models";
import db from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ formId: string }> }
) {
    try {
        const { formId } = await params;

        if (!formId || formId.trim().length === 0) {
            return new Response(JSON.stringify({ error: "Form ID is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }
      

       const form: Forms[] = await db.select("*")
            .from("forms")
            .where("formId", formId)

            //get user browser url
            const userBrowserUrl = request.headers.get('referer') || 'unknown';
            // check if he has formResponse at the end of url

            const hasFormResponse = userBrowserUrl.endsWith("formResponse");

            // check if form is published if user is formResponse url

            if(hasFormResponse && !form[0].is_published){
                return new Response(JSON.stringify({
                    message: "Form not found",
                    status:404,
                }),{
                    status:404
                })
            }

            if (hasFormResponse) {
                // increase view count
                await db("forms")
                    .where("formId", formId)
                    .increment("view_count", 1);
            }

         



            
      

      if(form.length > 0){

            return new Response(JSON.stringify(
                {
                    formId: formId,
                    formTitle: form[0].title,
                    formDescription: form[0].description,
                    elements: (form[0].elements),
                    is_published:form[0].is_published
                }
            ), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });

      }
      else {

          return new Response(JSON.stringify({ error: "Form not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
          });
      }

        // For now, let's just return a 404 since the form doesn't exist yet
        // This will allow your frontend to work and create new forms

    } catch (error) {
        console.error('API error:', error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}