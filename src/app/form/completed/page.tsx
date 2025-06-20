'use client';
import Image from 'next/image';

export default function FormCompleted() {
  return (
    <div className="max-w-2xl mx-auto mt-24 p-10 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center text-center">
      <div className="mb-4 flex items-center justify-center">
        <Image src="/images/icons8-double-tick-100.png" alt="Form Submitted" width={40} height={40} />
      </div>
      <h2 className="text-3xl font-bold mb-4 text-[#1A2233]">Form Submitted</h2>
      <p className="text-lg text-[#4B5563]">Thank you for your time.<br />Your information has been received.</p>
    </div>
  );
}