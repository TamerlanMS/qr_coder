
import { useState } from 'react';
import ShipPage from './pages/ShipPage';
import ReturnPage from './pages/ReturnPage';
export default function App(){
 const [page,setPage]=useState('');
 if(!page){
  return(<div className="flex flex-col gap-4 items-center justify-center h-screen">
     <button className="btn" onClick={()=>setPage('ship')}>Отгрузка</button>
     <button className="btn" onClick={()=>setPage('return')}>Возврат</button>
  </div>);
 }
 const goHome=()=>setPage('');
 return page==='ship'?<ShipPage onBack={goHome}/> : <ReturnPage onBack={goHome}/>;
}
