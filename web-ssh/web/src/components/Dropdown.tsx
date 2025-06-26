import { useState, useRef, useEffect } from "react";
import '../styles/Dropdown.css';

interface DropdownProps {
    triggerLabel: React.ReactNode;
    items: { content: React.ReactNode; /*onClick: () => void*/ }[];
    // style: Record<string, string>;
}
export default function Dropdown({ triggerLabel, items }: DropdownProps) {

    const dropdownRef = useRef<HTMLInputElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        function handleClickOutside(e: Event) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { // so ts doesnt yell at me casted as Node
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div ref={dropdownRef} className="dropdown-wrapper">
            <button onClick={() => { setIsOpen(!isOpen) }} className="">
                {triggerLabel}
            </button>
            {isOpen &&
                <ul className="dropdown-menu">
                    {/* {items.map((item, idx) => {
                    <li>yo</li>
                })} */}
                    {items.map((item, idx) => (
                        <li key={idx} /*onClick={() => { item.onClick(); setIsOpen(false); }}*/>
                            {item.content}
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
}