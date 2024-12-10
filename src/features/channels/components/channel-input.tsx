'use client'

import dynamic from 'next/dynamic';
import type Quill from 'quill';
import { useRef } from 'react';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChannelInputProps {
  placeholder: string
}

const ChannelInput = ({ placeholder }: ChannelInputProps) => {
  const editorRef = useRef<Quill | null>(null)

  return ( 
    <div className="w-full px-5">
      <Editor 
        variant='create' 
        onSubmit={() => {}} 
        innerRef={editorRef} 
        disabled={false} 
        placeholder={placeholder}
      />
    </div>
   );
}
 
export default ChannelInput;
