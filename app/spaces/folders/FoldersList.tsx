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
  foldersL: Folder[];
  folders: Folder[];
  lists: List[];
  folderLists: { [key: string]: List[] };
  toggleFolders: (folderId: string, index: number) => void;  
}

const FoldersList: React.FC<FoldersListProps> = ({ foldersL, folders, lists, folderLists, toggleFolders }) => {

  return (
    
    <div>
      {foldersL.map((folder, index) => (
        
        <div key={index}>
          <FolderItem folder={folder} />
        </div>
      ))}
    </div>
  );
};

const FolderItem = ({folder} : {folder:Folder}) => {
  const [loading, setLoading] = useState(false);
  const extractFolderData = (id : string) => {
    setLoading(true);
    fetch(`/api/export/download?folderId=${id}`)
    .then( res => res.blob() )
    .then( blob => {
      var file = window.URL.createObjectURL(blob);
      window.location.assign(file);
    }).finally(()=> {
      setLoading(false)
    });
  }
  return (
      <div
        className="flex text-gray-600 w-full border-b overflow-hidden mt-32 md:mt-0 mb-5 mx-auto"
      >
        <div className="flex px-2 py-3">
            <button className="hover:underline" onClick={() => extractFolderData(folder.id)} disabled={loading}>
              {folder.name} 
            </button> 
        </div>
      </div>
  )
}

export default FoldersList;
