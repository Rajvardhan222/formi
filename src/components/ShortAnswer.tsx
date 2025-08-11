import React from "react";
import { Input } from "./ui/input";
 import { ExampleCombobox as Compobobox } from "./ui/Combobox";
import { Trash2Icon } from "lucide-react";
import { Switch } from "./ui/switch";
type Props = {

};

const ShortAnswer = (props: Props) => {
    const [showDescription, setShowDescription] = React.useState(true);
  return (
    < div className="w-full py-4 px-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-md">
      <div className="flex gap-4">
       <div className="flex flex-col w-full">
         <Input type="text" placeholder="Question" />

         {/* //optionally show description */}

            {showDescription && (
            <Input
                type="text"
                placeholder="Description (optional)"
                className="mt-2"
            />
            )}
       </div>
        <Compobobox/>
      </div>
      <div className="w-full h-10"></div>
      <br className="w-full mx-10 bg-gray-600"/>
      <div className="flex justify-end mt-4 gap-x-4">
       
            {/* lucid delete icon */}
           <div className="px-6 border-r-2 border-gray-300 dark:border-gray-600 cursor-pointer ">
             <Trash2Icon className="h-6 w-6" />
           </div>
            <div className="flex items-center gap-2">
                <span className=" ">Required</span>
            <Switch />
            </div>
       
      </div>
    </div>
  );
};

export default ShortAnswer;
