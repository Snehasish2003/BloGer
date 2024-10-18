import { useEffect, useState } from 'react';
import { X, CirclePlus, ChevronDown, BriefcaseBusiness, MapPin, GraduationCap, CalendarDays } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../Firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Employment from './Employment';
import Education from './Education'; 
import Address from './Location'; 

const EditCredential = ({ selected, onClose }) => {
  const [User, setUser] = useState({});
  const [addOn, setAddOn] = useState(true);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [monthYear, setMonthYear] = useState('');
  const [openCreate, setOpenCreate] = useState(selected);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const currentUser = await getDoc(userRef);
        if (currentUser.exists()) {
          const userData = currentUser.data();
          setUser(userData);

         
          if (userData.joinedAt && userData.joinedAt.seconds) {
            const JoinDate = new Date(userData.joinedAt.seconds * 1000);
            const formattedMonthYear = JoinDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            });
            setMonthYear(formattedMonthYear);
          }
        } else {
          console.log("No such document");
        }
      } else {
        console.log("User not exist");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setOpenCreate(selected);
  }, [selected]);

  const handleCredentialClick = (credential) => {
    setSelectedCredential(credential);
    setAddOn(false); 
  };

  return (
    <>{
      !selectedCredential &&
    <div className={`absolute w-screen h-screen ${openCreate ? 'flex' : 'hidden'} justify-center items-center top-0 left-0 bg-[#363434e6]`}>
      <div className="w-[60%] h-[80%] bg-[#181818] relative p-5 rounded-lg">
        <X className="cursor-pointer" onClick={onClose} />
        <h2 className='text-xl mt-7'>Edit credentials</h2>
        <p className='text-md mt-2'>Credentials add credibility to your content</p>

        <div className='border gap-2 mt-5 relative hover:bg-slate-800 border-blue-600 rounded-3xl w-[30%] p-2 flex justify-center items-center' onClick={() => setAddOn(!addOn)}>
          <CirclePlus color='blue' />
          <p className='text-blue-600 text-sm'>Add a Credential</p>
          <ChevronDown width={20} color='blue' />
        </div>
        {addOn &&
          <div className='absolute ml-3 bg-neutral-800 w-[25%] mt-1'>
            <p className='text-sm p-4 flex gap-2 items-center border-b border-b-gray-600' onClick={() => handleCredentialClick('employment')}>
              <BriefcaseBusiness width={18} />Employment
            </p>
            <p className='text-sm p-4 flex gap-2 items-center border-b border-b-gray-600' onClick={() => handleCredentialClick('education')}>
              <GraduationCap width={18} />Education
            </p>
            <p className='text-sm p-4 flex gap-2 items-center border-b border-b-gray-600' onClick={() => handleCredentialClick('address')}>
              <MapPin width={18} />Address
            </p>
          </div>
        }

        <div className='mt-3'>YOUR CREDENTIALS</div>

        <div>
          <ul className='space-y-2'>
            <li className='flex gap-2'>
              {User.employment !== "" && <p className='flex items-center'><BriefcaseBusiness />{User.employment}</p>}
            </li>
            <li className='flex gap-2 items-center'>
              {User.eduction !== "" && <p className='flex items-center'><GraduationCap />{User.eduction}</p>}
            </li>
            <li className='flex gap-2 items-center'>
              {User.adress !== "" && <p className='flex items-center'><MapPin />{User.adress}</p>}
            </li>
            <li className='flex gap-2 items-center'>
              <CalendarDays /><p className=''>Joined {monthYear}</p>
            </li>
          </ul>
        </div>


      </div>
    </div>}
        <div className='mt-5'>
          {selectedCredential === 'employment' && <Employment />}
          {selectedCredential === 'education' && <Education />}
          {selectedCredential === 'address' && <Address />}
        </div>
        </>
  );
};

export default EditCredential;
