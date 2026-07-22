import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center gap-2 h-10 sm:h-12">
            <Image
                src="/logo.png"
                alt="MEDCRUSH Logo"
                width={60}
                height={60}
                className="object-contain h-8 sm:h-10 w-auto"
                priority
            />
            <div className="flex flex-col leading-tight">
                <span className="text-sm sm:text-base font-bold text-primary-600 dark:text-primary-400">
                    MEDCRUSH
                </span>
                <span className="text-[8px] sm:text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                    Blockchain Hospital
                </span>
            </div>
        </div>
    );
}