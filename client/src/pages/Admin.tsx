import { useState } from "react";
import { useStreams, useCreateStream, useUpdateStream, useDeleteStream } from "@/hooks/use-streams";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Activity,
  ServerCrash
} from "lucide-react";
import { Stream } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { z } from "zod";

// Create Form Schema based on the route input
const formSchema = api.streams.create.input;
type FormData = z.infer<typeof formSchema>;

export default function Admin() {
  const { data: streams, isLoading } = useStreams();
  const deleteMutation = useDeleteStream();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);

  const openCreateModal = () => {
    setEditingStream(null);
    setIsModalOpen(true);
  };

  const openEditModal = (stream: Stream) => {
    setEditingStream(stream);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Confirm deletion of this telemetry feed?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* HEADER */}
      <header className="h-16 flex items-center px-6 border-b border-border/50 bg-card sticky top-0 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mr-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-display uppercase text-sm font-semibold tracking-wider">Back to Track</span>
        </Link>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <div className="ml-6 flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary" />
          <h1 className="font-display text-lg font-bold tracking-widest text-white uppercase">
            Pit Wall <span className="text-muted-foreground font-light">Control</span>
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-white mb-2">Feed Management</h2>
            <p className="text-muted-foreground text-sm font-sans max-w-xl">
              Configure incoming stream telemetry. Changes applied here immediately reflect in the Apex Player.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 rounded-md font-display font-bold text-sm uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(225,6,0,0.3)] hover:shadow-[0_0_25px_rgba(225,6,0,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            Initialize Feed
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-card border border-border/50 rounded-lg shadow-2xl overflow-hidden relative">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse font-display uppercase tracking-widest">
              Establishing connection...
            </div>
          ) : !streams || streams.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <ServerCrash className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-display text-xl text-white uppercase mb-2">No Active Feeds</h3>
              <p className="text-muted-foreground max-w-sm">The telemetry databank is empty. Initialize a new feed to broadcast.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="py-4 px-6 font-display uppercase tracking-wider text-xs font-bold text-muted-foreground">ID</th>
                    <th className="py-4 px-6 font-display uppercase tracking-wider text-xs font-bold text-muted-foreground">Title</th>
                    <th className="py-4 px-6 font-display uppercase tracking-wider text-xs font-bold text-muted-foreground">Provider</th>
                    <th className="py-4 px-6 font-display uppercase tracking-wider text-xs font-bold text-muted-foreground">Quality</th>
                    <th className="py-4 px-6 font-display uppercase tracking-wider text-xs font-bold text-muted-foreground">Language</th>
                    <th className="py-4 px-6 font-display uppercase tracking-wider text-xs font-bold text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {streams.map((stream) => (
                    <tr key={stream.id} className="hover:bg-secondary/40 transition-colors group">
                      <td className="py-4 px-6 font-mono text-xs text-muted-foreground">{stream.streamId}</td>
                      <td className="py-4 px-6 font-sans font-medium text-white truncate max-w-[200px]">{stream.title}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{stream.provider}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-secondary text-white rounded border border-border/50">
                          {stream.quality}
                        </span>
                      </td>
                      <td className="py-4 px-6 uppercase text-sm font-bold text-muted-foreground">{stream.lang}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(stream)}
                            className="p-2 text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(stream.id)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <StreamModal 
          stream={editingStream} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

// Separate component for the Modal to keep state clean
function StreamModal({ stream, onClose }: { stream: Stream | null, onClose: () => void }) {
  const createMutation = useCreateStream();
  const updateMutation = useUpdateStream();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const isEdit = !!stream;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: stream ? {
      streamId: stream.streamId,
      title: stream.title,
      provider: stream.provider,
      lang: stream.lang,
      url: stream.url,
      quality: stream.quality,
    } : {
      streamId: "",
      title: "",
      provider: "",
      lang: "en",
      url: "",
      quality: "1080p",
    }
  });

  const onSubmit = (data: FormData) => {
    if (isEdit && stream) {
      updateMutation.mutate({ id: stream.id, ...data }, {
        onSuccess: onClose
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: onClose
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div className="relative bg-card w-full max-w-md border border-border/60 shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border/50 bg-secondary/50 flex justify-between items-center">
          <h3 className="font-display font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-primary transform rotate-45"></span>
            {isEdit ? "Update Telemetry" : "Initialize Feed"}
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-white transition-colors text-2xl leading-none"
          >&times;</button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground">Stream Title</label>
              <input 
                {...register("title")}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="e.g. F1 Grand Prix Main Feed"
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground">Internal ID</label>
              <input 
                {...register("streamId")}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all font-mono"
                placeholder="e.g. f1-main-01"
              />
              {errors.streamId && <p className="text-xs text-destructive mt-1">{errors.streamId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground">Provider</label>
              <input 
                {...register("provider")}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all"
                placeholder="e.g. Sky Sports"
              />
              {errors.provider && <p className="text-xs text-destructive mt-1">{errors.provider.message}</p>}
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground">Stream URL (iframe source)</label>
              <input 
                {...register("url")}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all font-mono"
                placeholder="https://..."
              />
              {errors.url && <p className="text-xs text-destructive mt-1">{errors.url.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground">Quality</label>
              <select 
                {...register("quality")}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all"
              >
                <option value="4K">4K UHD</option>
                <option value="1080p">1080p HD</option>
                <option value="720p">720p HQ</option>
              </select>
              {errors.quality && <p className="text-xs text-destructive mt-1">{errors.quality.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-display font-bold uppercase tracking-widest text-muted-foreground">Language</label>
              <input 
                {...register("lang")}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all uppercase"
                placeholder="EN"
                maxLength={3}
              />
              {errors.lang && <p className="text-xs text-destructive mt-1">{errors.lang.message}</p>}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-border/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded text-sm font-semibold text-white hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 rounded text-sm font-display font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-[0_0_10px_rgba(225,6,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPending ? "Transmitting..." : (isEdit ? "Confirm Update" : "Deploy Feed")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
