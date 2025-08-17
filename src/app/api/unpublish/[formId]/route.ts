import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const GET = async (req: Request) => {

    let {userId} = await auth();

    // get clients current url from url /publish/[formId]
   const formId = req.url.split("/").pop();
   const form = await  db('forms').where({ formId: formId,user_id:userId }).first();

   if (!form) {
       return new Response("Form not found", { status: 404 });
   }

    await db('forms').where({ formId: formId,user_id:userId }).update({ is_published: false });

   return new Response("Form published", { status: 200 });
};