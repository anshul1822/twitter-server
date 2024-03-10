import Image from 'next/image'
import { BsTwitter } from "react-icons/bs";
import { MdHomeFilled, MdOutlineNotifications, MdGroups } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { TiMessages } from "react-icons/ti";
import { FaUser } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { Inter } from 'next/font/google'
import React, { useCallback } from 'react';
import FeedCard from '@/components/FeedCard';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import toast, { Toaster } from 'react-hot-toast';
import { graphqlClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user';
import { useCurrentUSer } from '@/hooks/user';
import { useQueryClient } from '@tanstack/react-query';

const inter = Inter({ subsets: ['latin'] })

interface TwitterSideBarButton {
  title : string,
  icon : React.ReactNode;
}

const sideBarMenuItems : TwitterSideBarButton [] = [
  {
    title : 'Home',
    icon : <MdHomeFilled />
  },
  {
    title : 'Explore',
    icon : <CiSearch />
  },
  {
    title : 'Notifications',
    icon : <MdOutlineNotifications />
  },
  {
    title : 'Messages',
    icon : <TiMessages/>
  },
  {
    title : 'Communities',
    icon : <MdGroups/>
  },
  {
    title : 'Profile',
    icon : <FaUser />
  },
  {
    title : 'More',
    icon : <RxHamburgerMenu />
  }
]

export default function Home() {

  const {user} = useCurrentUSer();
  console.log(user);
  const queryClient = useQueryClient();

  const handleLoginWithGoogle = useCallback( async(cred : CredentialResponse )=> {
    const googleToken = cred.credential;
    console.log(googleToken);
    if(!googleToken) return toast.error("Google token not found");

    const { verifyGoogleToken } = await graphqlClient.request(verifyUserGoogleTokenQuery, {token : googleToken});

    toast.success('User Verified');
    toast.success('Successfully toasted!')
    console.log(verifyGoogleToken);

    if(verifyGoogleToken) window.localStorage.setItem('twitter_token', verifyGoogleToken);

    await queryClient.invalidateQueries(['current-user']);

  }, [])


  return (
    <div className='grid grid-cols-12 h-screen py-2 max-w-screen-xl mx-auto'>
      <div className='col-span-3 flex flex-col gap-3 justify-start px-4'>
        <div className='text-4xl h-fit w-fit hover:bg-gray-600 rounded-full p-2 cursor-pointer transition-all'>
          <BsTwitter fill="white"/>
        </div>
        <div>
          <ul className='text-xl mt-1 font-semibold gap-3'>
          {
            sideBarMenuItems.map((item) => (
              <li key={item.title} className='flex justify-start items-center w-fit gap-4 my-2 p-2 hover:bg-gray-600 rounded-md cursor-pointer transition-all'> 
                <span className='text-3xl'>{item.icon}</span>
                <span>{item.title}</span>
              </li>
            ))
          }
          </ul>
          <div className='mt-8 pr-10'>
          <button className='bg-[#1d9bf0] w-full p-2 text-lg font-bold rounded-full'>Tweet</button>
          </div>
        </div>
        {
            user && user.profileImage &&
            <div className='absolute bottom-5'> 
            <div className='flex gap-2 items-center bg-slate-700 rounded-full'>
              <Image src={user.profileImage}  alt="profilePicture" height={60} width={60} className='rounded-full'/>
              <div className='w-48 max-w-52 overflow-auto'> 
              <div className='text-lg'>{user.firstName} {user.lastName}</div>
              
              </div>
              </div></div>
          }
      </div>
      <div className='col-span-6 border-r-[1px] border-l-[1px] border-slate-800 h-screen overflow-scroll custom-scrollbar'>

          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
          <FeedCard/>
      </div>
      <div className='col-span-3'>
          {
             !user &&         <div className='border p-5 bg-slate-700 rounded-lg'>
             <h1>New To Twitter?</h1>
             <GoogleLogin onSuccess={handleLoginWithGoogle} />
           </div>
          }
      </div>

    </div>
  )
}
