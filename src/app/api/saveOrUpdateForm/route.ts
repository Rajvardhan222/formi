import db from '@/lib/db';

import { auth } from '@clerk/nextjs/server'
export async function POST(request: Request) {
    let {formId,formData} = await request.json();
     const { userId } = await auth()

        if(!userId){
            return new Response(JSON.stringify({error: "Authentication required"}), { status: 401 });
        }


    if(!formId){
        return new Response(JSON.stringify({error: "Form ID is required"}), { status: 400 });
    }


    // Check if the form already exists
    const existingForm = await db('forms').where({ formId: formId })


    if(existingForm.length > 0){
        //form already exists update its detail
        await db('forms')
            .where({ formId: formId , user_id: userId })
            .update({
                title: formData.title,
                description: formData.description,
                elements: JSON.stringify(formData.elements),
            });

        return new Response(JSON.stringify({message: "Form updated successfully"}), { status: 200 });
    }else {
        // create the new form
        await db('forms').insert({
            user_id:userId,
            formId: formId,
            title: formData.title,
            description: formData.description,
            elements: JSON.stringify(formData.elements),
        });

        return new Response(JSON.stringify({message: "Form created successfully"}), { status: 201 });
    }




}