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

        // For now, let's just return a 404 since the form doesn't exist yet
        // This will allow your frontend to work and create new forms
        return new Response(JSON.stringify({ error: "Form not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('API error:', error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}