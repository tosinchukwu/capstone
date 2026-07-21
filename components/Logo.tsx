export default function Logo() {
    return (
        <div className="flex flex-col items-start leading-tight">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 tracking-tight">
                MEDCRUSH
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase">
                Blockchain Hospital
            </span>
        </div>
    );
}