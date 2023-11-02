// FoldersList.tsx
import React from 'react';
import { Folder } from '@/models/folder';
import { List } from '@/models/list';
// import ListTasks from './lists/ListTasks';

interface ListsTaskProps {
  lists: List[];
  listTasks: { [key: string]: List[] };
  toggleSubReports: (folderId: string, index: number) => void;  
}

const FoldersList: React.FC<ListsTaskProps> = ({ lists }) => {

  
  return (
    <div>
      {lists.map((list, index) => (
        <div key={index}>
          <div
            className="flex text-gray-600 w-full border-b overflow-hidden mt-32 md:mt-0 mb-5 mx-auto"
            // onClick={() => toggleSubReports(folder.id, index)}
          >
            <div className={`w-10 border-r px-2 transform transition duration-500 ease-in-out ${list.reportsOpen ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75l-7.5-7.5-7.5 7.5" />
              </svg>
            </div>

            <div className="flex px-2 py-3">
              <div className="mx-3">
                <button className="hover:underline">{list.name}</button>
              </div>
            </div>
          </div>

          {/* {list.reportsOpen && (
            <div className="flex p-5 md:p-0 w-full transform transition duration-500 ease-in-out border-b pb-10">
              <div style={{ marginLeft: '4rem', paddingBottom: '1rem', fontFamily: 'Verdana' }}>
                <ListTasks lists={folderLists[folder.id] || []} />
              </div>
            </div>
          )} */}
        </div>
      ))}
    </div>
  );
};

export default FoldersList;
