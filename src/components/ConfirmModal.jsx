
export default function ConfirmModal({open,title,message,onYes,onNo}){
 if(!open) return null;
 return <div className="modal-bg">
   <div className="card text-center whitespace-pre-line">
     <h2 className="text-lg font-bold mb-2">{title}</h2>
     <p className="mb-4">{message}</p>
     <div className="flex justify-center gap-4">
       <button className="btn" onClick={onYes}>Да</button>
       <button className="btn bg-gray-400 hover:bg-gray-500" onClick={onNo}>Нет</button>
     </div>
   </div>
 </div>;
}
