import Image from "next/image";

export default function Logo() {
    return (
        <div className="flex items-center gap-3">
            <Image
                src="/logo.png"
                alt="MEDCRUSH Logo"
                width={120}
                height={120}
                className="object-contain w-32 sm:w-40 md:w-48 lg:w-52"
                priority
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