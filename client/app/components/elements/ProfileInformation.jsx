import React, { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { getUserInformation, uploadUserProfileImage } from "@/app/utils/user";
import Image from "next/image";

export default function ProfileInformation() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    bio: "",
    imageUrl: "",
    accountType: "",
    isActiveAccount: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserInformation();
        if (data.error) {
          setError(data.error);
        } else {
          setUserData({
            name: data.result.name || "",
            email: data.result.email,
            role: data.result.role,
            bio: data.result.bio || "",
            imageUrl: data.result.imageUrl || "https://via.placeholder.com/150",
            accountType: data.result.accountType,
            isActiveAccount:
              data.result.isActiveAccount !== undefined
                ? data.isActiveAccount
                : true,
            githubUrl: data.result.githubUrl || "",
            linkedinUrl: data.result.linkedinUrl || "",
            twitterUrl: data.result.twitterUrl || "",
            createdAt: data.result.createdAt || "",
          });
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatCreatedAtDate = new Date(userData.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  const handleDeactivateAccount = async () => {
    try {
      const response = await deactivateAccount();

      if (response.ok) {
        setUserData({ ...userData, isActiveAccount: false });
        setShowDeactivateModal(false);
      } else {
        console.error("Failed to deactivate account.");
      }
    } catch (error) {
      console.error("Error deactivating account:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await uploadUserProfileImage(formData);
        setUserData({ ...userData, imageUrl: response.imageUrl });
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("An error occurred while uploading the image.");
      }
    }
  };

  const baseURL = "https://blog.tariksogukpinar.dev/api"; // Base URL
  const placeholderImage = "https://via.placeholder.com/150";
  const fullImageUrl = userData.imageUrl
    ? `${baseURL}${userData.imageUrl}`
    : placeholderImage;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <div className="text-center">
        <label htmlFor="file-upload">
          <Image
            className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg mx-auto cursor-pointer"
            src={fullImageUrl}
            alt="Profile"
            width={48}
            height={48}
            priority={true}
            unoptimized={true}
          />
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">{`${userData.name}`}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Joined on : {formatCreatedAtDate}
        </p>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              disabled
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              disabled
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <input
            type="text"
            disabled
            value={userData.bio || "....."}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
            className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Type
          </label>
          <input
            type="text"
            value={
              userData.accountType === "FREE"
                ? "Free Account"
                : userData.accountType === "MEDIUM"
                ? "Medium Account"
                : userData.accountType === "PREMIUM"
                ? "Premium Account"
                : userData.accountType
            }
            readOnly
            className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Linkedin
          </label>
          <input
            type="text"
            disabled
            value={userData.linkedinUrl || "....."}
            onChange={(e) =>
              setUserData({ ...userData, linkedinUrl: e.target.value })
            }
            className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Github
          </label>
          <input
            type="text"
            disabled
            value={userData.githubUrl || "....."}
            onChange={(e) =>
              setUserData({ ...userData, githubUrl: e.target.value })
            }
            className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Twitter
          </label>
          <input
            type="text"
            disabled
            value={userData.twitterUrl || "....."}
            onChange={(e) =>
              setUserData({ ...userData, twitterUrl: e.target.value })
            }
            className="mt-2 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={!userData.isActiveAccount}
              onChange={() => {
                if (!userData.isActiveAccount) {
                  setShowDeactivateModal(true);
                } else {
                  console.log("Account is already deactivated.");
                }
              }}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Active Account
            </span>
          </label>
        </div>
      </form>

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Deactivate Account</h2>
            <p>Are you sure you want to deactivate your account?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
