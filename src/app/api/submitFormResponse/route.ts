import db from "@/lib/db";

export const POST = async (req: Request) => {
    try {
        
            let {responses, formId,completionTimeSeconds} = await req.json();

            //get users ip address
            const ip = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'unknown';
            // users browser user agent
            const userAgent = req.headers.get('user-agent') || 'unknown';

          let response =  await db("responses")
                .insert({
                    formId: formId,
                    response_data: JSON.stringify(responses),
                    completion_time_seconds: completionTimeSeconds,
                    ip_address: ip,
                    user_agent: userAgent,
                });

            console.log("Response inserted successfully:", response);
            
            // Create a secure cookie that users cannot edit/delete
            const cookieValue = `${formId}_${Date.now()}`;
            const cookieOptions = [
                `formSubmission=${cookieValue}`,
                 // Prevents JavaScript access
                            process.env.NODE_ENV === 'production' ? 'Secure' : '', // Only sent over HTTPS in production
                'SameSite=Strict', // CSRF protection
                'Max-Age=31536000', // 1 year expiration
                'Path=/' // Available site-wide
            ].join('; ');
            
            return new Response(JSON.stringify({ message: "Response submitted successfully" }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": cookieOptions,
                },
            });



    } catch (error) {
        console.log(error)
        return new Response("Internal Server Error", {
            status: 500,
        });
    }
}