import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import TipTap from '../../TipTap';
import { TeamMember } from '../AboutUsEditor';

interface TeamMembersEditorProps {
  showNotification: (type: 'success' | 'error', message: string) => void;
}

const TeamMembersEditor: React.FC<TeamMembersEditorProps> = ({ 
  showNotification 
}) => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<number | null>(null);
    const [newMember, setNewMember] = useState<boolean>(false);
    const [currentMember, setCurrentMember] = useState<TeamMember>({
        id: 0,
        name: '',
        position: '',
        bio: '',
        imageUrl: ''
    });
    const [savingBio, setSavingBio] = useState<boolean>(false);

    // Fetch team members on component mount
    useEffect(() => {
        fetchTeamMembers();
    }, []);
    
    // Fetch team members directly if needed
    const fetchTeamMembers = async () => {
        try {
        setLoading(true);
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            throw error;
        }

        setTeamMembers(data || []);
        } catch (error) {
        console.error('Error fetching team members:', error);
        showNotification('error', 'Failed to load team members');
        } finally {
        setLoading(false);
        }
    };

    // Handle input changes for regular form fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentMember({
        ...currentMember,
        [name]: value
        });
    };

    // Handle rich text content changes from TipTap
    const handleBioChange = (htmlContent: string) => {
        setSavingBio(true);
        setCurrentMember({
            ...currentMember,
            bio: htmlContent
        });
        setSavingBio(false);
    };

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `team-member-${Date.now()}.${fileExt}`;
        const filePath = `about_us/${fileName}`;
        
        setLoading(true);
        
        // Upload file to Storage
        const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(filePath, file);
            
        if (uploadError) {
            throw uploadError;
        }
        
        // Get the public URL
        const { data } = supabase.storage
            .from('assets')
            .getPublicUrl(filePath);
            
        setCurrentMember({
            ...currentMember,
            imageUrl: data.publicUrl
        });
        
        showNotification('success', 'Image uploaded successfully');
        } catch (error) {
        console.error('Error uploading image:', error);
        showNotification('error', 'Failed to upload image');
        } finally {
        setLoading(false);
        }
    };

    // Save team member (create or update)
    const saveMember = async () => {
        try {
        setLoading(true);
        
        // Validate required fields
        if (!currentMember.name || !currentMember.position) {
            showNotification('error', 'Name and position are required');
            return;
        }
        
        // If it's a new member
        if (newMember) {
            const { data, error } = await supabase
            .from('team_members')
            .insert([{
                name: currentMember.name,
                position: currentMember.position,
                bio: currentMember.bio,
                imageUrl: currentMember.imageUrl
            }])
            .select();
            
            if (error) {
            throw error;
            }
            
            if (data) {
            // Update state with the new member
            setTeamMembers([...teamMembers, data[0]]);
            showNotification('success', 'Team member added successfully');
            }
        } 
        // If updating existing member
        else {
            const { error } = await supabase
            .from('team_members')
            .update({
                name: currentMember.name,
                position: currentMember.position,
                bio: currentMember.bio,
                imageUrl: currentMember.imageUrl
            })
            .eq('id', currentMember.id);
            
            if (error) {
            throw error;
            }
            
            // Update state with edited member
            const updatedMembers = teamMembers.map(member => 
            member.id === currentMember.id ? currentMember : member
            );
            setTeamMembers(updatedMembers);
            showNotification('success', 'Team member updated successfully');
        }
        
        // Reset form
        resetForm();
        } catch (error) {
        console.error('Error saving team member:', error);
        showNotification('error', 'Failed to save team member');
        } finally {
        setLoading(false);
        }
    };

    // Delete team member
    const deleteMember = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this team member?')) {
        try {
            setLoading(true);
            
            const { error } = await supabase
            .from('team_members')
            .delete()
            .eq('id', id);
            
            if (error) {
            throw error;
            }
            
            // Update state
            setTeamMembers(teamMembers.filter(member => member.id !== id));
            showNotification('success', 'Team member deleted successfully');
        } catch (error) {
            console.error('Error deleting team member:', error);
            showNotification('error', 'Failed to delete team member');
        } finally {
            setLoading(false);
        }
        }
    };

    // Reset form and exit edit mode
    const resetForm = () => {
        setCurrentMember({
        id: 0,
        name: '',
        position: '',
        bio: '',
        imageUrl: ''
        });
        setEditMode(null);
        setNewMember(false);
    };

    // Start editing a member
    const startEditing = (member: TeamMember) => {
        setCurrentMember({...member});
        setEditMode(member.id);
        setNewMember(false);
    };

    // Start adding a new member
    const startAddingMember = () => {
        resetForm();
        setNewMember(true);
    };

    // Order team members (basic implementation)
    const reorderMembers = async (id: number, direction: 'up' | 'down') => {
        const currentIndex = teamMembers.findIndex(member => member.id === id);
        if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === teamMembers.length - 1)
        ) {
        return; // Can't move further in this direction
        }

        try {
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const reorderedMembers = [...teamMembers];
        
        // Swap positions
        [reorderedMembers[currentIndex], reorderedMembers[newIndex]] = 
        [reorderedMembers[newIndex], reorderedMembers[currentIndex]];
        
        // Update state first for immediate UI feedback
        setTeamMembers(reorderedMembers);
        
        // Then update in database (would require a more sophisticated approach with order columns)
        // This is a simplified implementation
        showNotification('success', 'Team members reordered');
        } catch (error) {
        console.error('Error reordering members:', error);
        showNotification('error', 'Failed to reorder team members');
        }
    };

    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Team Members</h2>
            <button
            onClick={startAddingMember}
            disabled={loading || newMember || editMode !== null}
            className="btn btn-primary btn-sm"
            >
            Add Team Member
            </button>
        </div>

        {/* Edit/Add Form */}
        {(editMode !== null || newMember) && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">
                {newMember ? 'Add New Team Member' : 'Edit Team Member'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                </label>
                <input
                    type="text"
                    name="name"
                    value={currentMember.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                />
                </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                </label>
                <input
                    type="text"
                    name="position"
                    value={currentMember.position}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                />
                </div>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
                </label>
                {/* Replace textarea with TipTap editor */}
                <TipTap
                    initialContent={currentMember.bio}
                    onSave={handleBioChange}
                    isSaving={savingBio}
                    saveButtonText="Apply Changes"
                    loadingSaveText="Applying..."
                    editorHeight="min-h-[200px]"
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
                </label>
                <div className="flex items-start space-x-4">
                {currentMember.imageUrl && (
                    <img 
                    src={currentMember.imageUrl}
                    alt={currentMember.name}
                    className="w-24 h-24 object-cover rounded-md"
                    />
                )}
                <div>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="file-input file-input-bordered w-full max-w-xs"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 400x400px
                    </p>
                </div>
                </div>
            </div>
            
            <div className="flex justify-end space-x-2">
                <button
                onClick={resetForm}
                className="btn btn-ghost btn-sm"
                disabled={loading}
                >
                Cancel
                </button>
                <button
                onClick={saveMember}
                className="btn btn-primary btn-sm"
                disabled={loading}
                >
                {loading ? 'Saving...' : 'Save Member'}
                </button>
            </div>
            </div>
        )}

        {/* Team Members List */}
        <div className="overflow-x-auto">
            {teamMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
                No team members added yet. Click the button above to add your first team member.
            </p>
            ) : (
            <table className="table w-full">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {teamMembers.map((member) => (
                    <tr key={member.id}>
                    <td>
                        {member.imageUrl ? (
                        <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-12 h-12 object-cover rounded-full"
                        />
                        ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image</span>
                        </div>
                        )}
                    </td>
                    <td>{member.name}</td>
                    <td>{member.position}</td>
                    <td>
                        <div className="flex space-x-2">
                        <button
                            onClick={() => reorderMembers(member.id, 'up')}
                            className="btn btn-ghost btn-xs"
                            disabled={loading || teamMembers.indexOf(member) === 0}
                        >
                            ↑
                        </button>
                        <button
                            onClick={() => reorderMembers(member.id, 'down')}
                            className="btn btn-ghost btn-xs"
                            disabled={loading || teamMembers.indexOf(member) === teamMembers.length - 1}
                        >
                            ↓
                        </button>
                        <button
                            onClick={() => startEditing(member)}
                            className="btn btn-ghost btn-xs"
                            disabled={loading || editMode !== null || newMember}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteMember(member.id)}
                            className="btn btn-ghost btn-xs text-red-500"
                            disabled={loading}
                        >
                            Delete
                        </button>
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
        </div>
    );
};

export default TeamMembersEditor;