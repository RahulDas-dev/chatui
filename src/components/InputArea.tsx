import { useState, memo, useEffect, useRef, useCallback } from 'react';
import { FiPaperclip, FiPlus, FiClipboard } from 'react-icons/fi';
import { CiLocationArrow1 } from 'react-icons/ci';
import { Button } from './ui/Button';
import { useChatContext } from '../hooks/useChatContext';
import { FileUploadDisplay } from './FileUploadDisplay';

interface InputAreaProps {
  onFileUpload?: (files: File[]) => void;
  onSendMessage?: (message: string) => void;
  disableInput?: boolean;
}

export const InputArea = memo(({ onFileUpload, onSendMessage, disableInput }: InputAreaProps) => {
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    onUserMessageSend,
    onFileUpload: contextFileUpload,
    waitingForResponse,
  } = useChatContext();

  // Determine if input should be disabled
  const isDisabled = disableInput !== undefined ? disableInput : waitingForResponse;

  // Function to adjust textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate the content height
    const contentHeight = textarea.scrollHeight;
    const maxHeight = 120;

    if (contentHeight > maxHeight) {
      // If content exceeds max height, set to max and enable scrolling
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    } else {
      // Otherwise, set to content height and hide scrollbar
      textarea.style.height = `${contentHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
  };
  // Function to focus textarea
  const focusTextarea = useCallback(() => {
    if (textareaRef.current && !isDisabled) {
      textareaRef.current.focus();
    }
  }, [isDisabled]);
  // Focus textarea when component mounts and when disabled state changes
  useEffect(() => {
    // Short delay to ensure the DOM is ready
    const timer = setTimeout(focusTextarea, 100);
    return () => clearTimeout(timer);
  }, [focusTextarea]);

  // Adjust height whenever input text changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    if (onSendMessage) {
      // Use the prop if provided
      onSendMessage(inputText);
    } else {
      // Otherwise use the context
      onUserMessageSend(inputText);
    }

    setInputText('');
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (onFileUpload) {
      onFileUpload(fileArray);
    } else if (contextFileUpload) {
      // Use the context's file upload function
      contextFileUpload(fileArray);
    }
  };

  // Update handleFileUpload to also update the local state
  const handleLocalFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...fileArray]);

    handleFileUpload(files);
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="px-4 bg-white dark:bg-zinc-900 py-4">
      <div className="">
        <FileUploadDisplay files={uploadedFiles} onRemoveFile={handleRemoveFile} />

        <div className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm">
          <div className="flex items-center p-2">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-grow w-full bg-transparent px-3 py-2 text-zinc-900 dark:text-zinc-300 focus:outline-none font-mono text-sm resize-none min-h-[40px] max-h-[120px] overflow-y-auto custom-scrollbar"
              placeholder="Reply to Meta AI..."
              disabled={isDisabled}
              rows={1}
            />
          </div>

          <div className="flex justify-between items-center px-2 py-1 ">
            <div className="flex items-center gap-2">
              {' '}
              <Button
                variant="icon"
                size="small"
                tooltip="Add content"
                className="text-zinc-500 dark:text-zinc-400"
                disabled={isDisabled}
              >
                <FiPlus className="h-5 w-5" />
              </Button>
              <label>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => handleLocalFileUpload(e.target.files)}
                  disabled={isDisabled}
                />
                <Button
                  variant="icon"
                  size="small"
                  tooltip="Attach file"
                  className="text-zinc-500 dark:text-zinc-400"
                  disabled={isDisabled}
                >
                  <FiPaperclip className="h-5 w-5" />
                </Button>
              </label>{' '}
              <Button
                variant="icon"
                size="small"
                tooltip="Clipboard"
                className="text-zinc-500 dark:text-zinc-400"
                disabled={isDisabled}
              >
                <FiClipboard className="h-5 w-5" />
              </Button>
            </div>

            <Button
              variant="icon"
              size="normal"
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isDisabled}
              tooltip="Send message"
              className="h-8 w-8 flex items-center justify-center text-black"
            >
              {' '}
              <CiLocationArrow1 className="text-black" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
