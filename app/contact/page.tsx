"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' }); // Reset form after submission
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Get in Touch</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Have a question, suggestion, or need support? We&apos;d love to hear from you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gray-50 p-8 rounded-lg shadow-md">
          {/* Contact Information */}
          <div className="flex flex-col justify-center space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
            <p className="text-gray-600">Fill out the form and our team will get back to you within 24 hours. For urgent inquiries, please call us.</p>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Phone className="h-6 w-6 mr-3 text-blue-600 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="h-6 w-6 mr-3 text-blue-600 flex-shrink-0" />
                <span>support@rentify.pune</span>
              </div>
              <div className="flex items-start text-gray-700">
                <MapPin className="h-6 w-6 mr-3 text-blue-600 flex-shrink-0 mt-1" />
                <span>Our office is based in Pune, Maharashtra. We primarily serve students across all major college areas.</span>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-inner">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows={5} 
                  required 
                  value={formData.message} 
                  onChange={handleChange} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}