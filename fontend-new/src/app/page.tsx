import Image from 'next/image'
import Link from 'next/link'
import type { JSX } from 'react'

type Feature = {
    id: 'order' | 'menu' | 'revenue'
    title: string
    description: string
    icon: JSX.Element
    href: string
}

function IconReceipt() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
            <path
                d="M7 3h10a2 2 0 0 1 2 2v14l-3-1-3 1-3-1-3 1V5a2 2 0 0 1 2-2Zm2 4h6M9 9h6M9 13h6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    )
}
function IconCoffee() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
            <path
                d="M4 8h12a4 4 0 1 0 0 8H8a4 4 0 0 1-4-4V8Zm12 0v8M7 4s0 2 2 2 2 2 2 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    )
}
function IconChart() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
            <path
                d="M4 19V5M20 19H4M8 15v-4M12 19v-8M16 13V8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default function Home(): JSX.Element {
    const features: Feature[] = [
        {
            id: 'order',
            title: 'Đặt hàng',
            description: 'Tạo đơn hàng mới, quản lý order của khách và theo dõi trạng thái',
            icon: <IconReceipt />,
            href: '/order',
        },
        {
            id: 'menu',
            title: 'Danh sách đồ uống',
            description: 'Xem và chỉnh sửa menu, cập nhật giá và thông tin sản phẩm',
            icon: <IconCoffee />,
            href: '/menu',
        },
        {
            id: 'revenue',
            title: 'Doanh thu',
            description: 'Theo dõi doanh số theo ngày, tuần, tháng và báo cáo',
            icon: <IconChart />,
            href: '/revenue',
        },
    ]

    return (
        <div
            id="home"
            className="flex h-full w-full flex-1 flex-col items-center justify-around px-8 py-12 select-none lg:flex-row"
        >
            {/* Logo section */}
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
                <div className="">
                    <Image
                        src="/logo.jpg"
                        alt="DRIFT Coffee Logo"
                        width={120}
                        height={120}
                        className="h-[120px] w-[120px] rounded-2xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-105"
                        priority
                    />
                </div>
                <div className="*:text-center">
                    <h1 className="from-foreground to-foreground/80 bg-gradient-to-br bg-clip-text text-5xl font-bold tracking-[-0.02em] text-transparent lg:text-4xl">
                        DRIFT Coffee
                    </h1>
                    <p className="text-muted-foreground mt-2 text-[1.1rem]">
                        If you can dream it, you can do it {'>..<'}
                    </p>
                </div>
            </div>

            {/* Features section */}
            <div className="flex flex-1 flex-col items-start justify-center">
                <div className="flex w-full max-w-[500px] flex-col gap-6">
                    {features.map((feature) => (
                        <Link
                            key={feature.id}
                            href={feature.href}
                            className="group bg-secondary relative flex h-32 w-xl flex-row items-center justify-start gap-6 overflow-hidden rounded-2xl border p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--secondary-hover)]"
                        >
                            <span className="bg-element text-foreground flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110">
                                {feature.icon}
                            </span>
                            <span className="flex-1">
                                <span className="block text-[1.35rem] font-semibold tracking-[-0.01em]">
                                    {feature.title}
                                </span>
                                <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                                    {feature.description}
                                </span>
                            </span>
                            {/* subtle highlight */}
                            <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                style={{
                                    background:
                                        'linear-gradient(45deg, color-mix(in oklab, white 10%, transparent), transparent)',
                                }}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
