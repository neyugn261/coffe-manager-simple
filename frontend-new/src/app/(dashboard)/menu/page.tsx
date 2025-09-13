'use client'
import MenuEditor from '@/components/(dashboard)/menu/MenuEditor'
import TableEditor from '@/components/(dashboard)/menu/TableEditor'
import Header from '@/components/(dashboard)/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Armchair, Soup } from 'lucide-react'
import React from 'react'

const tabs: { value: string; label: string; icon: React.ReactNode; description: string }[] = [
    {
        value: 'menu',
        label: 'Quản lý món',
        icon: <Soup />,
        description:
            'Quản lý các món ăn trong menu của quán cà phê. Thêm, chỉnh sửa và xóa món một cách dễ dàng.',
    },
    {
        value: 'tables',
        label: 'Quản lý bàn',
        icon: <Armchair />,
        description:
            'Cấu hình và quản lý các bàn trong nhà hàng của bạn. Theo dõi trạng thái và sắp xếp bố trí một cách hiệu quả.',
    },
]

export default function MenuSetupPage() {
    return (
        <div className="bg-background">
            <Header title="Thiết lập Menu & Bàn" />

            <div className="container mx-auto h-full max-w-7xl px-8 py-6">
                <div className="overflow-hidden rounded-xl border">
                    <Tabs defaultValue="menu" className="w-full">
                        {/* Enhanced Tab Navigation */}
                        <TabsList className="flex h-auto w-full flex-row justify-center rounded-none md:justify-start lg:gap-2">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="data-[state=active]:bg-background data-[state=active]:text-foreground relative flex-1 cursor-pointer overflow-hidden rounded-none px-3 py-3 font-medium transition-all duration-200 data-[state=active]:rounded-t-lg data-[state=active]:border-hidden sm:px-6 sm:py-4 lg:max-w-xs"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="text-lg transition-transform group-hover:scale-110 sm:text-xl">
                                            {tab.icon}
                                        </span>
                                        <span className="text-sm font-semibold sm:text-base">
                                            {tab.label}
                                        </span>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Content Areas with better spacing */}
                        <div className="h-full px-4 py-6 sm:px-8 sm:py-10">
                            {tabs.map((tab) => (
                                <TabsContent
                                    key={tab.value}
                                    value={tab.value}
                                    className="focus-visible:outline-none"
                                >
                                    <div>
                                        {/* Enhanced Header */}
                                        <div className="from flex flex-col items-start gap-4 p-4 select-none sm:mb-8 sm:flex-row sm:gap-6 sm:p-6">
                                            <div className="bg-card flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl sm:h-16 sm:w-16 sm:text-3xl">
                                                {tab.icon}
                                            </div>
                                            <div className="flex flex-1 flex-col gap-2 md:gap-3">
                                                <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                                                    {tab.label}
                                                </h1>
                                                <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                                                    {tab.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content with responsive container */}
                                        <div className="h-fit md:max-h-[400px]">
                                            {tab.value === 'menu' && <MenuEditor />}
                                            {tab.value === 'tables' && <TableEditor />}
                                        </div>
                                    </div>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
