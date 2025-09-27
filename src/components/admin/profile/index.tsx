"use client";

interface IProfileId {
  profileId: string;
  profile: {
    name: string;
    avatar: string;
    address: string;
    bio: string;
    phone: string;
  };
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Camera, Image as ImageIcon, Loader2, Pencil, X } from "lucide-react";
import { uploadFile, UpdateProfile } from "@/service/user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileComponent = ({ profileId, profile }: IProfileId) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    avatar: profile.avatar,
    address: profile.address,
    bio: profile.bio,
    phone: profile.phone,
    file: null as File | null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(profile.avatar || null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  useEffect(() => {}, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      const url = URL.createObjectURL(file);
      setPreview(url);
      setIsEditingImage(true);
    }
  };

  const handleCancelImage = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }));
    setPreview(profile.avatar || null);
    setIsEditingImage(false);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = formData.avatar;

    if (formData.file) {
      try {
        imageUrl = await uploadFile(formData.file, formData.avatar);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Upload gagal:", err.message);
        } else {
          toast.error("Upload Gagal");
        }
        return;
      }
    }

    const id = profileId;
    const name = formData.name;
    const bio = formData.bio;
    const address = formData.address;
    const phone = formData.phone;
    const avatar = imageUrl;

    const insertData = {
      id,
      name,
      bio,
      address,
      phone,
      avatar,
    };

    const res = await UpdateProfile(insertData);

    if (!res.status) {
      toast.error("Gagal edit data");
      setIsLoading(false);
    }

    toast.success(res.pesan);
    setIsEdit(false);
    setIsLoading(false);
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Informasi Profil</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Perbarui detail pribadi dan gambar profil Anda
          </p>
        </div>
        <Button
          onClick={() => setIsEdit(!isEdit)}
          className={`cursor-pointer ${
            isEdit
              ? "bg-red-500 text-white shadow-xs hover:bg-red-600"
              : "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
          }`}
          size="sm"
        >
          {isEdit ? (
            <>
              <X className="w-4 h-4 mr-1" />
              Batal
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleEdit} encType="multipart/form-data">
          <div className="flex flex-col mb-6 gap-3">
            <Avatar className="w-24 h-24">
              {preview ? (
                <AvatarImage src={preview} alt="Avatar" />
              ) : (
                <AvatarFallback>
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </AvatarFallback>
              )}
            </Avatar>

            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="avatarUpload"
            />

            {isEdit && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("avatarUpload")?.click()
                  }
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Ubah Gambar
                </Button>
                {isEditingImage && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleCancelImage}
                  >
                    Batal
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                name="name"
                placeholder="Masukkan Nama"
                disabled={!isEdit}
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor Telepon
                </label>
                <Input
                  name="phone"
                  disabled={!isEdit}
                  placeholder="Masukkan Nomor Telepon"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Alamat</label>
                <Input
                  name="address"
                  value={formData.address || ""}
                  disabled={!isEdit}
                  placeholder="Masukkan Alamat"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Input
                name="bio"
                placeholder="Masukkan Bio"
                disabled={!isEdit}
                value={formData.bio || ""}
                onChange={handleChange}
              />
            </div>
            {isEdit && (
              <Button
                type="submit"
                className="float-right mt-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memuat...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileComponent;
