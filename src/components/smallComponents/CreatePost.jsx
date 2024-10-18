import { useEffect, useState } from 'react';
import { X, Globe, ChevronDown } from 'lucide-react';
import TextEditor from './TextEditor';

const CreatePost = ({ selected, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('Create Post');
  const [openCreate, setOpenCreate] = useState(selected);

  useEffect(() => {
    setOpenCreate(selected);
  }, [selected]);

  return (
    <div className={`fixed inset-0 ${openCreate ? 'flex' : 'hidden'} justify-center items-center bg-[#363434e6]`}>
      <div className="w-[90%] sm:w-[80%] md:w-[70%]  lg:w-[60%] h-[50%] sm:h-[90%] bg-[#181818] relative p-3 sm:p-5 rounded-lg">
        <X className="absolute top-2 sm:top-3 left-2 sm:left-3 cursor-pointer" onClick={onClose} />
        <div className="flex w-full justify-center items-center">
          <div className="flex gap-1 text-sm p-2 cursor-pointer hover:bg-[#282829] hover:rounded-3xl">
            <Globe height={20} />
            <p>Everyone</p>
            <ChevronDown height={20} />
          </div>
        </div>
        <div className="w-full flex text-sm font-medium mt-4 sm:mt-6 border-b-[2px] border-[#282829]">
          <p
            className={`flex justify-center items-center p-2 sm:p-3 w-[50%] cursor-pointer hover:bg-[#282829] ${
              selectedTab === 'Ask a Question' ? 'border-b-[3px] border-[#3333b6]' : ''
            }`}
            onClick={() => setSelectedTab('Ask a Question')}
          >
            Ask a Question
          </p>
          <p
            className={`flex justify-center items-center p-2 sm:p-3 w-[50%] cursor-pointer hover:bg-[#282829] ${
              selectedTab === 'Create Post' ? 'border-b-[3px] border-[#3333b6]' : ''
            }`}
            onClick={() => setSelectedTab('Create Post')}
          >
            Create Post
          </p>
        </div>
        <TextEditor />
      </div>
    </div>
  );
};

export default CreatePost;
