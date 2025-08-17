import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

   try {
     const {userId} = await auth();
 
     if(!userId){
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     }
     const formList = await db("forms").where("user_id", userId).orderBy("created_at", "desc");
 
               
     return NextResponse.json(formList);
   } catch (error) {
       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
   }
}
