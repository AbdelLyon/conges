export interface Site {
   id: number;
   name: string;
}

export interface FormValues {
   ids: Site[];
   id: string;
   name: string;
   documentation: File[];
}

export interface DocumentationModalProps {
   fetchDocuments: () => void;
   trigger: React.ReactNode;
}

export interface SelectOption {
   key: string;
   label: string;
}

export interface SiteMultiSelectProps {
   placeholder: string;
   options: SelectOption[];
   className?: string;
   selectedKeys: Set<string>;
   onSelectionChange: (keys: Set<string>) => void;
   error?: string;
   selectAll?: boolean;
   onSelectAllChange?: (value: boolean) => void;
}

export interface FilePickerProps {
   onFilesChange?: (files: File[]) => void;
   error?: string;
   value?: File[];
}

export interface FilePreviewProps {
   file: File;
   onRemove: () => void;
}