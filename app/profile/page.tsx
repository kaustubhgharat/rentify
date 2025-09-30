"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { UserCircle, Edit, Save, Loader2,  KeyRound } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user: authUser, loading: authLoading } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [formError, setFormError] = useState('');
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/signin');
            return;
        }
        if (authUser) {
            setFormData({ username: authUser.username, email: authUser.email });
        }
    }, [authUser, authLoading, router]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();
        setFormError('');
        setIsSubmittingProfile(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setIsEditing(false);
                alert("Profile updated successfully!");
                router.refresh(); 
            } else {
                setFormError(data.error);
            }
        } catch (err) {
            console.log(err);
            setFormError("An error occurred. Please try again.");
        } finally {
            setIsSubmittingProfile(false);
        }
    };
    
    const handlePasswordUpdate = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setIsSubmittingPassword(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match.");
            setIsSubmittingPassword(false);
            return;
        }

        try {
            const res = await fetch('/api/profile/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordData),
            });
            const data = await res.json();
            if (data.success) {
                setPasswordSuccess("Password updated successfully!");
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPasswordError(data.error);
            }
        } catch (err) {
            console.log(err);
            setPasswordError("An error occurred. Please try again.");
        } finally {
            setIsSubmittingPassword(false);
        }
    };
    
    if (authLoading || !authUser) {
        return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>;
    }

    return (
        <main className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200/80 relative">
                    <button onClick={() => setIsEditing(!isEditing)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition" title={isEditing ? 'Cancel Edit' : 'Edit Profile'}>
                        {isEditing ? <Save size={20} className="text-teal-600"/> : <Edit size={20} className="text-slate-500"/>}
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <UserCircle size={100} strokeWidth={1} className="text-slate-400" />
                        <div className="text-center md:text-left w-full">
                           {isEditing ? (
                               <form onSubmit={handleUpdateProfile} className="space-y-4">
                                   <div>
                                       <label htmlFor="username" className="text-xs font-medium text-slate-500">Username</label>
                                       <input id="username" type="text" name="username" value={formData.username} onChange={handleInputChange} className="text-3xl font-bold text-slate-900 w-full border-b-2 p-1 focus:outline-none focus:border-teal-500" />
                                   </div>
                                   <div>
                                       <label htmlFor="email" className="text-xs font-medium text-slate-500">Email</label>
                                       <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} className="text-slate-500 w-full border-b-2 p-1 focus:outline-none focus:border-teal-500" />
                                   </div>
                                   {formError && <p className="text-sm text-red-500">{formError}</p>}
                                   <button type="submit" disabled={isSubmittingProfile} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:bg-slate-400">
                                     {isSubmittingProfile ? 'Saving...' : 'Save Profile'}
                                   </button>
                               </form>
                           ) : (
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">{authUser.username}</h1>
                                    <p className="text-slate-500 mt-1">{authUser.email}</p>
                                </div>
                           )}
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-slate-600">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${authUser.role === 'owner' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>{authUser.role}</span>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 pt-6 border-t">
                             <h3 className="text-xl font-bold text-slate-800 mb-4">Change Password</h3>
                             <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-sm">
                                <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="password" name="currentPassword" placeholder="Current Password" value={passwordData.currentPassword} onChange={handlePasswordInputChange} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg" required /></div>
                                <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="password" name="newPassword" placeholder="New Password" value={passwordData.newPassword} onChange={handlePasswordInputChange} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg" required /></div>
                                <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="password" name="confirmPassword" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg" required /></div>
                                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                                {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
                                <button type="submit" disabled={isSubmittingPassword} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:bg-slate-400">
                                    {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                             </form>
                        </div>
                    )}
                </div>

                
            </div>
        </main>
    );
}