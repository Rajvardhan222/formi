import db from '@/lib/db';

export async function POST(request: Request) {
    let {formId,formData} = await request.json();

    if(!formId){
        return new Response(JSON.stringify({error: "Form ID is required"}), { status: 400 });
    }

    console.log("Received form data:", formData);

    // Check if the form already exists
    const existingForm = await db('forms').where({ formId: formId })


    if(existingForm.length > 0){
        //form already exists update its detail
        await db('forms')
            .where({ formId: formId })
            .update({
                title: formData.title,
                description: formData.description,
                elements: JSON.stringify(formData.elements),
            });

        return new Response(JSON.stringify({message: "Form updated successfully"}), { status: 200 });
    }else {
        // create the new form
        await db('forms').insert({
            formId: formId,
            title: formData.title,
            description: formData.description,
            elements: JSON.stringify(formData.elements),
        });

        return new Response(JSON.stringify({message: "Form created successfully"}), { status: 201 });
    }




}