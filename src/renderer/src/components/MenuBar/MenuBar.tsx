import { useRef } from "react";



function MenuBar():JSX.Element {
  const minimizeRef = useRef('minimize')
  const maximizeRef = useRef('maximize')
  const closeRef = useRef('closeWindow')

  const handleMinimize = (): void => {
    window.electron.ipcRenderer.send(minimizeRef.current);
  };
  const handleMaximize = (): void => {
    window.electron.ipcRenderer.send(maximizeRef.current);
  };
  const handleClose = (): void => {
    window.electron.ipcRenderer.send(closeRef.current);
  };

  return (
    <div className="w-full bg-slate-800 text-sm dragable">
        <div className="flex justify-between">
          <p className="p-2 text-slate-500">Expense Calendar</p>
          <div className="no-dragable">
            <button className="hover:bg-slate-700 px-4 h-full" onClick={handleMinimize}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 18 52 52" fill="#335075" stroke="#335075" enableBackground="new 0 0 52 52" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M50,48.5c0,0.8-0.7,1.5-1.5,1.5h-45C2.7,50,2,49.3,2,48.5v-3C2,44.7,2.7,44,3.5,44h45 c0.8,0,1.5,0.7,1.5,1.5V48.5z">
                </path> </g> </g>
              </svg>
            </button>
            <button className="hover:bg-slate-700 px-4 h-full"  onClick={handleMaximize}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none" stroke="#335075" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3">
                </path></g>
              </svg>
            </button>
            <button className="hover:bg-rose-600 px-4 h-full" onClick={handleClose}>
              <svg width="12px" height="12px" viewBox="0 0 16 16" version="1.1" stroke="#335075"  xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#444" d="M16 0l-1 0.010-7 6.99-7-6.99-1-0.010v1l7 7-7 7v1h1l7-7 7 7h1v-1l-7-7 7-7v-1z">
                </path> </g>
              </svg>
            </button>
          </div>
        </div>
    </div>
  )
};

export default MenuBar;