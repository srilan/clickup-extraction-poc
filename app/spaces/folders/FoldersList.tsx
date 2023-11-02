// FoldersList.tsx
import React, { useState } from 'react';
import { Folder } from '@/models/folder';
import { List } from '@/models/list';
import ListTasks from './lists/ListTasks';

interface SelectedId {
  id: string,
  selected: boolean,
}

interface FoldersListProps {
  folders: Folder[];
  folderLists: { [key: string]: List[] };
  toggleSubReports: (folderId: string, index: number) => void;  
}

const FoldersList: React.FC<FoldersListProps> = ({ folders, folderLists, toggleSubReports }) => {

  const [selectedIds, setSelectedIds] = useState<SelectedId[]>([]);
  return (
    
    <div>
      {folders.map((folder, index) => (
        
        <div key={index}>
           <div className="flex items-center" style={{ marginLeft: '-1.5rem', display: 'flex', marginBottom: '-1.3rem'}} >
            <input 
              id="checked-checkbox" 
              type="checkbox" 
              onChange={(e)=>{
                selectedIds[index] = {
                  selected: e.target.checked,
                  id: folder.id
                }
                setSelectedIds(selectedIds)
              }}
              checked={selectedIds[folder.id]}
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div
            className="flex text-gray-600 w-full border-b overflow-hidden mt-32 md:mt-0 mb-5 mx-auto"
            onClick={() => toggleSubReports(folder.id, index)}
          >
            <div className={`w-10 border-r px-2 transform transition duration-500 ease-in-out ${folder.reportsOpen ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75l-7.5-7.5-7.5 7.5" />
              </svg>
            </div>

            <div className="flex px-2 py-3">
              <div className="mx-3">
                <button className="hover:underline">{folder.name}</button>
              </div>
            </div>
          </div>

          {folder.reportsOpen && (
            <div className="flex p-5 md:p-0 w-full transform transition duration-500 ease-in-out border-b pb-10">
              <div style={{ marginLeft: '4rem', paddingBottom: '1rem', fontFamily: 'Verdana' }}>
                <ListTasks lists={folderLists[folder.id] || []} listTasks={{}} toggleSubReports={toggleSubReports}
                           />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoldersList;
