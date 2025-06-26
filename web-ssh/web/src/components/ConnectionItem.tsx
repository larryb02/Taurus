import { type Connection } from "../types";
import { useNavigate } from "react-router-dom";
import '../styles/Connections/ConnectionItem.css';
import { useSessionsContext } from '../context/SessionsContext';
import { useState, useRef, useEffect } from "react";
import Dropdown from "./Dropdown";

interface ConnectionItemProps {
    connection: Connection;
}

export default function ConnectionItem({ connection }: ConnectionItemProps) {
    const nav = useNavigate();
    const { setActiveSession } = useSessionsContext();
    const dropdownRef = useRef<HTMLInputElement | null>(null);
    const [isDropDownClicked, setIsDropDownClicked] = useState(false);
    
    useEffect(() => {
        function handleClickOutside(e: Event) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) { // so ts doesnt yell at me casted as Node
                setIsDropDownClicked(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    return (
        <div className="connection_item">
            <div className="connection_details">{connection.label}</div>
            <div className="connect-button">
                <button onClick={() => {
                    console.log(`Launching ${JSON.stringify(connection)}`);
                    setActiveSession(connection);
                    nav("/session"); {/* bare minimum to start a terminal */ }
                }}>Connect
                </button>
                <Dropdown triggerLabel=":" items={[{
                    "content":"Edit"
                }, {
                    "content":"Remove"
                }]}/>
                {/* <div ref={dropdownRef} className="dropdown-wrapper">
                    <button onClick={() => {
                        setIsDropDownClicked(!(isDropDownClicked))
                        console.log(isDropDownClicked)
                    }}
                        // onBlur={setIsDropDownClicked(!(isDropDownClicked))
                        // } 
                        className="dropdown">
                        :
                    </button>
                    {isDropDownClicked &&
                        <ul className="dropdown-menu">
                            <li>Edit</li>
                            <li>Remove</li>
                        </ul>
                        } */}
                {/* </div> */}
            </div>
        </div>
    );
}