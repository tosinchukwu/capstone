import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center gap-2">
            <Image
                src="/logo.svg"
                alt="MEDCRUSH Logo"
                width={40}
                height={40}
                className="object-contain"
            />
            <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    MEDCRUSH
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                    Blockchain Hospital
                </span>
            </div>
        </div>
    );
}