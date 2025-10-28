"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react";
import { getProfileUser } from "@/service/auth";
import { UpdateProfile, uploadFile } from "@/service/user";
import { IUserProfile } from "@/types/auth.type";
import { toast } from "sonner";
import Image from "next/image";

const ProfileMember = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<IUserProfile>({
    id: "",
    name: "",
    avatar: "",
    bio: "",
    address: "",
    phone: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    const res = await getProfileUser();

    if (res.status && res.data) {
      setProfile(res.data.profile);
      setPreviewUrl(res.data.profile.avatar || "");
    }

    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan perubahan...");

    try {
      let avatarUrl = profile.avatar;

      if (selectedFile) {
        avatarUrl = await uploadFile(selectedFile, profile.avatar);
      }

      const res = await UpdateProfile({
        ...profile,
        avatar: avatarUrl,
      });

      if (res.status) {
        toast.success("Profile berhasil diperbarui", { id: toastId });
        setIsEditing(false);
        fetchProfile();
      } else {
        toast.error(res.pesan || "Gagal memperbarui profile", { id: toastId });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6">
          <h2 className="text-2xl font-bold text-white">Profil Saya</h2>
          <p className="text-white/80 text-sm mt-1">
            Kelola informasi profil Anda
          </p>
        </div>

        {/* Avatar Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {isEditing ? "Klik untuk mengubah foto" : ""}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2 text-orange-600" />
              Nama Lengkap
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 mr-2 text-orange-600" />
              Bio
            </label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 mr-2 text-orange-600" />
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-orange-600" />
              Alamat
            </label>
            <textarea
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Edit Profil
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                  setSelectedFile(null);
                }}
                disabled={isSaving}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileMember;
