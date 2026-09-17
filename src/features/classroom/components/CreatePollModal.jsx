import { useState } from "react";
import { BarChart2, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

export function CreatePollModal({
  isOpen,
  onClose,
  onSavePoll,
  initialPoll = null,
}) {
  const [question, setQuestion] = useState(initialPoll?.question || "");
  const [options, setOptions] = useState(
    initialPoll?.options?.map((opt) => opt.text || opt.label) || ["", ""]
  );
  const [duration, setDuration] = useState(initialPoll?.duration || "24 Hours");
  const [error, setError] = useState("");

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
    if (error) setError("");
  };

  const handleSave = (e) => {
    e.preventDefault();
    const validOptions = options.map((opt) => opt.trim()).filter(Boolean);

    if (validOptions.length < 2) {
      setError("Please provide at least 2 distinct poll options.");
      return;
    }

    const pollData = {
      id: `poll-${Date.now()}`,
      question: question.trim() || "What do you think?",
      options: validOptions.map((text, idx) => ({
        id: `opt-${idx + 1}`,
        text,
        votes: 0,
      })),
      totalVotes: 0,
      duration,
      status: `Voting open (${duration})`,
    };

    onSavePoll(pollData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <BarChart2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-heading">
                Create Campus Poll
              </DialogTitle>
              <DialogDescription className="text-xs text-text-muted">
                Ask a question and get instant peer feedback with live results.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-3.5 mt-2">
          <div>
            <label className="text-xs font-semibold text-text-heading">
              Poll Question
            </label>
            <Input
              type="text"
              placeholder="e.g. Best framework for final capstone project?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 h-9 text-xs sm:text-sm bg-canvas/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-heading">
              Options (2-5)
            </label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="h-8 text-xs bg-canvas/50"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-1.5 text-text-muted hover:text-destructive transition cursor-pointer"
                    title="Remove option"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline pt-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add another option</span>
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-text-heading">
              Poll Duration
            </label>
            <div className="mt-1.5 flex gap-2">
              {["24 Hours", "3 Days", "1 Week"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`flex-1 rounded-lg border py-1 text-xs font-medium transition cursor-pointer select-none ${
                    duration === d
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border bg-canvas/40 text-text-muted hover:text-text-heading"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive font-medium">{error}</p>
          )}

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs font-semibold"
            >
              Attach Poll
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePollModal;
