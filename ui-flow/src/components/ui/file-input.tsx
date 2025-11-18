import * as React from "react";
import { cn } from "@/lib/utils";

export interface FlowFileInputProps {
    id?: string;
    label?: string;
    defaultValue?: string;
    value?: string;
    accept?: string;
    onChange?: (filePath: string) => void;
    className?: string;
}

const FlowFileInput = React.forwardRef<HTMLDivElement, FlowFileInputProps>(
    ({ accept, onChange, className }, ref) => {
        const fileInputRef = React.useRef<HTMLInputElement>(null);

        const handleButtonClick = () => {
            fileInputRef.current?.click();
        };

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                // Try to get full path - note: browsers restrict this for security
                // We'll use the best available path information
                let path = file.name;

                // Try to get more path information if available
                // @ts-ignore - webkitRelativePath is not in standard types
                if (file.webkitRelativePath) {
                    // @ts-ignore
                    path = file.webkitRelativePath;
                }

                if (onChange) {
                    onChange(path);
                }
            }
        };

        return (
            <div ref={ref} className={cn("flex flex-col", className)}>
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className={cn(
                        "w-full h-7 rounded border border-input bg-white text-[12px] font-medium shadow-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-shadow"
                    )}
                >
                    Open
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        );
    }
);

FlowFileInput.displayName = "FlowFileInput";

export { FlowFileInput };
