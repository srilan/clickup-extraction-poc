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
  workspaceFolders: { [key: string]: Folder[] };
  folderLists: { [key: string]: List[] };
  toggleReports: (spaceId: string, index: number) => void;
  toggleSubReports: (folderId: string, index: number) => void;
}


const SpacesList: React.FC<SpacesListProps> = ({
  spaces,
  workspaceFolders,
  folderLists,
  toggleReports,
  toggleSubReports,
}) => {

  const [selectedIds, setSelectedIds] = useState<SelectedId[]>([]);
  const [loading, setLoading] = useState(false);


  return (
    <table className="table-fixed mt-20">
    <thead>
      <tr>
        <th></th>
        <th style={{ fontFamily: 'Verdana', color: '#526E8E', display: 'flex', marginBottom: 30, marginLeft: 50 }}>
          Name
        </th>
      </tr>
    </thead>

    <tbody style={{ width: 'max-content' }}>
    {spaces.map((space, index) => (
        <tr key={index}>
          <td style={{ width: '1%'}}>
          <div className="flex items-center" >
            <input 
              id="checked-checkbox" 
              type="checkbox" 
              onChange={(e)=>{
                selectedIds[index] = {
                  selected: e.target.checked,
                  id: space.id
                }
                setSelectedIds(selectedIds)
              }}
              checked={selectedIds[space.id]}
              className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          </td>
          <td>
            <div
              className="flex items-center text-gray-600 w-full border-b overflow-hidden mt-32 md:mt-0 mb-5 mx-auto"
              onClick={() => toggleReports(space.id, index)}
            >
              <div className={`w-10 border-r px-2 transform transition duration-500 ease-in-out ${space.reportsOpen ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75l-7.5-7.5-7.5 7.5" />
                </svg>
              </div>

              <div className="flex px-2 py-3">
                <div className="mx-3">
                  <button className="hover:underline">{space.name}</button>
                </div>
              </div>
            </div>

            {space.reportsOpen && (
              <div className="flex p-5 md:p-0 w-full transform transition duration-500 ease-in-out border-b pb-10">
                <div style={{ marginLeft: '4rem', paddingBottom: '1rem', fontFamily: 'Verdana' }}>
                  <FoldersList folders={workspaceFolders[space.id] || []} folderLists={folderLists} 
                  toggleSubReports={toggleSubReports} 
                  />
                </div>
              </div>
            )}
          </td>
        </tr>
      ))}
    </tbody>

    <Button 
          type="button"
          variant="outline"
          onClick={()=> {
            fetch("/api/export/run", {
              method: "post",
            })
          }}
          className="uppercase text-sm rounded-sm w-60 mt-2 lg:w-full" loading={loading}>
            Generate
        </Button>
  </table>
  );
};

export default SpacesList;
