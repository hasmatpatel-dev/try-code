'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Image as ImageIcon,
  Search,
  Upload,
  Copy,
  Trash2,
  Loader2,
  File,
  X,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';

const fetchMediaList = async (bucket: string) => {
  const { data } = await axios.get(`/api/media/list?bucket=${bucket}`);
  return data;
};

export default function MediaLibraryPage() {
  const queryClient = useQueryClient();
  const [bucket, setBucket] = useState('blog-images');
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch media assets
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ['mediaList', bucket],
    queryFn: () => fetchMediaList(bucket),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      const { data } = await axios.post('/api/media/upload', formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaList', bucket] });
      toast.success('Media file uploaded successfully!');
    },
    onError: (err: any) => {
      toast.error('Upload failed. Please try again.');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (url: string) => {
      await axios.post('/api/media/delete', {
        bucket,
        paths: [url],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaList', bucket] });
      toast.success('Media asset deleted');
      setSelectedAsset(null);
    },
    onError: () => {
      toast.error('Failed to delete media asset');
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        uploadMutation.mutate(files[i]);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        uploadMutation.mutate(files[i]);
      }
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (url: string) => {
    if (confirm('Are you sure you want to delete this media asset permanently?')) {
      deleteMutation.mutate(url);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Filter list by search query
  const filteredMedia = mediaItems?.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Media Library</h1>
          <p className="text-sm text-gray-400">Upload and organize images, tutorials assets, and course attachments.</p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <select
            value={bucket}
            onChange={(e) => {
              setBucket(e.target.value);
              setSelectedAsset(null);
            }}
            className="rounded-xl border border-[#161C2C] bg-[#090D1A] px-3.5 py-2 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="blog-images">Blog Images</option>
            <option value="avatars">User Avatars</option>
            <option value="course-images">Course Attachments</option>
          </select>
        </div>
      </div>

      {/* Drag & drop upload target */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-2xl border border-dashed p-8 text-center transition flex flex-col items-center justify-center cursor-pointer min-h-[160px] ${
          dragging
            ? 'border-purple-500 bg-purple-500/5'
            : 'border-[#161C2C] bg-[#090D1A]/30 hover:bg-[#090D1A]/50'
        }`}
      >
        <input
          type="file"
          id="fileUpload"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center select-none">
          {uploadMutation.isPending ? (
            <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-3" />
          ) : (
            <Upload className="h-10 w-10 text-gray-500 mb-3" />
          )}
          <span className="text-sm font-semibold text-white">
            Drag & drop files here, or <span className="text-purple-400 hover:text-purple-300">browse files</span>
          </span>
          <span className="text-xs text-gray-500 mt-1">Upload covers, banners or profile pictures.</span>
        </label>
      </div>

      {/* Filters Toolbar */}
      <div className="relative">
        <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Filter assets by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#161C2C] bg-[#090D1A]/50 py-2 pl-9 pr-4 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-purple-500"
        />
      </div>

      {/* Media Grid & Details Panel layout */}
      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Assets Grid */}
        <div className={`lg:col-span-${selectedAsset ? '3' : '4'} space-y-4`}>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : !filteredMedia || filteredMedia.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#161C2C] bg-[#090D1A]/20 py-16 text-center">
              <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No assets found</h3>
              <p className="text-sm text-gray-500 mt-1">Drop a new image above to populate the folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item: any) => {
                const isImage = item.metadata.mimetype?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(item.url);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAsset(item)}
                    className={`rounded-2xl border overflow-hidden bg-[#090D1A] group cursor-pointer transition select-none flex flex-col justify-between ${
                      selectedAsset?.id === item.id
                        ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-purple-500/5'
                        : 'border-[#161C2C] hover:border-gray-700'
                    }`}
                  >
                    <div className="aspect-square bg-gray-950 flex items-center justify-center relative overflow-hidden">
                      {isImage ? (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <File className="h-12 w-12 text-gray-700" />
                      )}
                    </div>
                    <div className="p-3 border-t border-[#161C2C] bg-[#090D1A]/40 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-gray-300 truncate flex-1">{item.name}</span>
                      <span className="text-[10px] text-gray-500 shrink-0">{formatBytes(item.metadata.size)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Asset Details drawer */}
        {selectedAsset && (
          <div className="rounded-2xl border border-[#161C2C] bg-[#090D1A]/70 p-6 shadow-xl backdrop-blur-xl space-y-5 lg:col-span-1 sticky top-24">
            <div className="flex items-center justify-between border-b border-[#161C2C] pb-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">Asset Details</h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-gray-500 hover:text-white transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Preview */}
            <div className="aspect-video bg-gray-950 rounded-xl overflow-hidden border border-[#161C2C] flex items-center justify-center">
              {selectedAsset.metadata.mimetype?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(selectedAsset.url) ? (
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <File className="h-12 w-12 text-gray-600" />
              )}
            </div>

            {/* Info list */}
            <div className="space-y-3 divide-y divide-[#161C2C] text-xs">
              <div className="flex justify-between py-2 first:pt-0">
                <span className="text-gray-500">Filename</span>
                <span className="text-white font-semibold truncate max-w-[150px]" title={selectedAsset.name}>
                  {selectedAsset.name}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">File size</span>
                <span className="text-white font-semibold">{formatBytes(selectedAsset.metadata.size)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Mime type</span>
                <span className="text-white font-semibold truncate max-w-[150px]">{selectedAsset.metadata.mimetype}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Uploaded</span>
                <span className="text-white font-semibold">
                  {format(new Date(selectedAsset.created_at), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2 border-t border-[#161C2C]">
              <button
                onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                className="w-full flex items-center justify-center rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 py-2.5 text-xs font-semibold hover:bg-purple-600/20 transition active:scale-95"
              >
                {copiedId === selectedAsset.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Image URL
                  </>
                )}
              </button>
              <button
                onClick={() => handleDelete(selectedAsset.url)}
                className="w-full flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 py-2.5 text-xs font-semibold hover:bg-red-500/20 transition active:scale-95"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Asset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
