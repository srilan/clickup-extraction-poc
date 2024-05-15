import React, { ReactNode, useState } from "react";

interface DropdownLayoutProps {
    children: ReactNode;
    text?: string;
}

const DropdownLayout: React.FC<DropdownLayoutProps> = ({ children, text }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return ( 
        <div className="flex row " >
            <div onClick={toggleDropdown} className={`w-10 border-r px-2 `}>
                <div className={`text-black dark:text-black transform transition duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75l-7.5-7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
            <div className="text-black dark:text-black"onClick={toggleDropdown}>{text}</div>
            {isOpen && (
                <div className="py-8">
                    {children}
                </div>
            )}
        </div>
     );
}
 
export default DropdownLayout;
