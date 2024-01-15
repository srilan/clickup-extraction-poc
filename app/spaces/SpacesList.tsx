// SpacesList.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Space } from '@/models/spaces';
import { Folder } from '@/models/folder';
import { List } from '@/models/list';
import FoldersList from './folders/FoldersList';

interface SelectedId {
  id: string,
  selected: boolean,
}

interface SpacesListProps {
  spaces: Space[];
  folders: Folder[];
  lists: List[];
  workspaceFolders: { [key: string]: Folder[] };
  folderLists: { [key: string]: List[] };
  toggleSpaces: (spaceId: string, index: number) => void;
  toggleFolders: (folderId: string, index: number) => void;
}


const SpacesList: React.FC<SpacesListProps> = ({
  spaces,
  folders,
  lists,
  workspaceFolders,
  folderLists,
  toggleSpaces,
  toggleFolders,
}) => {

  const [selectedIds, setSelectedIds] = useState<SelectedId[]>([]);
  const [loading, setLoading] = useState(false);
 

  const extractFolderData = async (id : string, name: string) => {
    setLoading(true);
    let tasks = "";
    let data = {
      last_page: false,
      data: "",
    };
    let page = 0;
    do {
      data = await fetch(`/api/export/download?folderId=${id}&page=${page}`)
      .then( res => res.json());
      tasks = tasks  +  data.data + "\n";
      page++;
    } while(!data.last_page)
    
    //var file = window.URL.createObjectURL(blob);
    //window.location.assign(file);
    const url = window.URL.createObjectURL(
      new Blob([tasks]),
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${name}_${new Date().toLocaleTimeString()}.csv`,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    if(link.parentNode)
      link.parentNode.removeChild(link);
    
    setLoading(false);
  }
  return (
  <>
  {/* Checks if spaces is accessible, since we lose access to everything if the response 
  from spaces/get is an empty array, we go directly to the folders.*/}
    {spaces.length === 0 ? (
      folders.map((folder, index) => (
        <div key={index}>
          <div
            className="flex items-center text-gray-600 w-full overflow-hidden mt-32 md:mt-0 mb-5 mx-auto"
            onClick={() => extractFolderData(folder.id, folder.name)}
          >
            <div className={`w-10 border-r px-2 `}>
              <div className={`transform transition duration-500 ease-in-out ${folder.foldersOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75l-7.5-7.5-7.5 7.5" />
              </div>
            </div>

            <div className="flex px-2 py-3">
              <div className="mx-3">
                <button className="hover:underline">{folder.name}</button>
              </div>
            </div>

            {folder.foldersOpen && (
                <div className="flex p-5 md:p-0 w-full transform transition duration-500 ease-in-out border-b pb-10">
                <div style={{ marginLeft: '4rem', paddingBottom: '1rem', fontFamily: 'Verdana' }}>

                </div>
              </div>
              )}
          </div>
        </div>
      ))
    ) : (
      spaces.map((space, index) => (
        <div key={index}>
          <div
            className="flex items-center text-gray-600 w-full border-b overflow-hidden mt-32 md:mt-0 mb-5 mx-auto"
            onClick={() => toggleSpaces(space.id, index)}
          >
            <div className={`w-10 border-r px-2 `}>
              <div className={`transform transition duration-500 ease-in-out ${space.spacesOpen ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75l-7.5-7.5-7.5 7.5" />
                  </svg>
                </div>
            </div>

            <div className="flex px-2 py-3">
                  <div className="mx-3">
                    <button className="hover:underline">{space.name}</button>
                  </div>
            </div>

            {space.spacesOpen && (
                <div className="flex p-5 md:p-0 w-full transform transition duration-500 ease-in-out border-b pb-10">
                  <div style={{ marginLeft: '4rem', paddingBottom: '1rem', fontFamily: 'Verdana' }}>
                    <FoldersList foldersL={workspaceFolders[space.id] || []} folders={folders} lists={lists} folderLists={folderLists} 
                    toggleFolders={toggleFolders} 
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      ))
    )}
  </>
);
};

export default SpacesList;
