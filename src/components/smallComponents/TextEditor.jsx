import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';
import { Cloudinary } from 'cloudinary-core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db, auth } from '../../Firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,  
});

function TextEditor() {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [uid, setUid] = useState(null);
  const [category, setCategory] = useState(''); 
  const quillRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ align: ['right', 'center', 'justify'] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['image'],
    ],
  };

  const formats = [
    'header',
    'font',
    'list',
    'bullet',
    'bold',
    'italic',
    'underline',
  ];

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.focus();
    }
  }, []);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji || emojiData.native || '';
    setText((prevText) => prevText + emoji.trim());
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (file) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Blogger');

    return fetch(
      `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setImageUploading(false);
        if (data.secure_url) {
          setImageUrl(data.secure_url);
          return data.secure_url;
        } else {
          throw new Error(data.error.message);
        }
      })
      .catch((error) => {
        setImageUploading(false);
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
        return null;
      });
  };

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const imageHandler = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          if (file) {
            const imageUrl = await handleImageUpload(file);
            if (imageUrl) {
              const range = quill.getSelection();
              if (range) {
                quill.insertEmbed(range.index, 'image', imageUrl);
                quill.setSelection(range.index + 1);
              } else {
                quill.insertEmbed(quill.getLength(), 'image', imageUrl);
              }
            }
          }
        };
      };

      quill.getModule('toolbar').addHandler('image', imageHandler);
    }
  }, []);

  const handlePostSubmit = async () => {
    if (!uid) {
      toast.error('Please sign in to submit a post.');
      return;
    }

    if (imageUploading) {
      toast.warning('Image is still uploading. Please wait...');
      return;
    }

    if (!text.trim() && !imageUrl) {
      toast.error('Please write something or upload an image to submit a post.');
      return;
    }

    if (!category) {
      toast.error('Please select a category.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        uid,
        text,
        imageUrl: imageUrl || '',
        category, // Include selected category
        votes: 0,
        shares: 0,
        timestamp: serverTimestamp(),
      });
      toast.success('Post submitted successfully!');
      setText('');
      setImageUrl('');
      setCategory(''); // Reset category
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Failed to submit post. Please try again.');
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4 bg-[#181818] text-white">
      <div className="relative">
        <ReactQuill
          ref={quillRef}
          value={text}
          onChange={setText}
          modules={modules}
          formats={formats}
          theme="snow"
          className="min-h-[200px] sm:min-h-[300px] text-white bg-[#282828] border border-[#333] rounded-md"
        />
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      <div className="w-full">
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-500 bg-[#282828] text-white text-sm rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          <option value="Health">Health</option>
          <option value="News">News</option>
          <option value="Blogs">Blogs</option>
        </select>
      </div>

      <button
        onClick={handlePostSubmit}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Submit Post
      </button>
    </div>
  );
}

export default TextEditor;
