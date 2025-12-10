
import React, { useState, useMemo, useRef } from 'react';
import { Layout } from './components/Layout';
import { parseReceiptImage } from './services/geminiService';
import {
    Transaction,
    TransactionType,
    PaymentMethod,
    FinancialSource,
    ExpenseCategory,
    Staff,
    ReceiptItem,
    DailyClose,
    BackupData
} from './types';
import {
    CreditCard,
    Wallet,
    Coins,
    TrendingDown,
    TrendingUp,
    Loader2,
    Camera,
    Upload,
    CheckCircle2,
    Trash2,
    Plus,
    Pencil,
    PiggyBank,
    ArrowUpCircle,
    ArrowDownCircle,
    FileSpreadsheet,
    Table2,
    Users,
    ArrowLeft,
    Building2,
    ArrowRight,
    X,
    ImageIcon,
    Globe,
    Tags,
    FolderTree,
    List,
    MinusCircle,
    Save,
    History,
    Download,
    RotateCcw,
    ShieldCheck
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

// --- TRANSLATIONS ---
type Language = 'ko' | 'en';

const TRANSLATIONS = {
    ko: {
        headerTitle: "강원푸드",
        headerSubtitle: "재무 관리 시스템",
        nav: {
            dashboard: "대시보드",
            add: "입력",
            scan: "영수증",
            reports: "리포트",
            settings: "설정"
        },
        sources: {
            [PaymentMethod.CASH]: "현금 (금고)",
            [PaymentMethod.CARD]: "법인 카드",
            [PaymentMethod.GCASH]: "G-Cash"
        },
        assetStatus: "자산 및 계정 현황",
        todayChange: "오늘 변동",
        customerCardSales: "고객카드매출",
        corporateCardExpense: "법인카드지출",
        cardIncome: "카드 수입",
        totalIncome: "총 수입",
        totalExpense: "총 지출",
        incomeLedger: "수입 원장",
        expenseLedger: "지출 원장",
        recentTransactions: "최근 내역",
        recent5: "최근 5건",
        noTransactions: "내역이 없습니다.",
        addExpense: "비용 (지출)",
        addIncome: "수입 (매출)",
        date: "날짜",
        staff: "담당자",
        addStaff: "담당자 추가",
        paymentMethod: "결제 수단",
        depositMethod: "입금 계좌/수단",
        category: "카테고리",
        addCategory: "카테고리 추가",
        description: "사용처 (설명)",
        incomeDescription: "수입 내용 (설명)",
        descPlaceholderExp: "예: 강원식자재마트",
        descPlaceholderInc: "예: 10월 24일 저녁 매출",
        amount: "금액 (PHP)",
        depositAmount: "입금액 (PHP)",
        submitExpense: "지출 등록하기",
        submitIncome: "수입 등록하기",
        cardHelper: "* 고객 카드 매출로 등록되며, 관련 비용 계정이 상계 처리됩니다.",
        moneyHelper: "* 선택한 자금 원장의 잔액이 증가합니다.",
        aiComplete: "AI 인식 완료",
        scanTitle: "영수증 촬영",
        scanDesc: "영수증 사진을 올리면 AI가 자동으로 날짜, 금액, 사용처를 입력해줍니다.",
        analyzing: "분석 중입니다...",
        uploadPhoto: "사진 업로드",
        scanError: "영수증 분석에 실패했습니다. 다시 시도해주세요.",
        incomeStats: "총 수입",
        expenseStats: "총 지출",
        paymentMethodBreakdown: "결제 수단별 입출금",
        income: "수입",
        expense: "지출",
        categoryExpense: "카테고리별 지출",
        staffExpense: "담당자별 지출",
        allTransactions: "전체 내역",
        backOfficeBtn: "백오피스 (관리자)",
        backOfficeDesc: "원장 관리 및 데이터 베이스",
        managePaymentMethods: "결제 수단 관리",
        manageCategories: "카테고리 관리",
        initialBalance: "초기 잔액",
        edit: "수정",
        delete: "삭제",
        cancel: "취소",
        add: "추가",
        save: "저장",
        name: "이름",
        role: "직책/역할",
        rolePlaceholder: "예: 홀 매니저",
        namePlaceholder: "예: 홍길동",
        categoryNamePlaceholder: "예: 배달 대행료",
        sourceNamePlaceholder: "예: 비상금",
        confirmDeleteSource: "이 결제 수단을 삭제하시겠습니까? 연결된 거래 내역은 유지되지만 결제 수단 정보는 사라질 수 있습니다.",
        confirmDeleteCategory: "이 카테고리를 삭제하시겠습니까?",
        confirmDeleteTx: "이 내역을 삭제하시겠습니까?",
        backOfficeTitle: "백오피스 (Admin)",
        backOfficeSubtitle: "데이터 베이스 및 원장 관리",
        downloadCsv: "엑셀 다운로드",
        journal: "통합 전표 (Journal)",
        ledger: "계정별 원장 (Ledger)",
        staffManage: "인사 관리 (Staff)",
        type: "구분",
        proof: "증빙",
        account: "계정(출처)",
        content: "내용",
        manage: "관리",
        selectLedger: "원장 선택:",
        currentBalance: "현재잔액",
        initialBalItem: "기초 잔액 (Initial Balance)",
        inDebit: "입금 (차변)",
        outCredit: "출금 (대변)",
        balance: "잔액",
        staffList: "직원 목록",
        confirmDeleteStaff: "직원을 삭제하시겠습니까?",
        language: "언어 (Language)",
        newCategory: "새 카테고리 이름",
        categoryHelper: "'-'를 사용하여 그룹을 만들 수 있습니다. (예: 식자재-육류)",
        detectedItems: "인식된 품목 (편집 가능)",
        addItem: "품목 추가",
        itemName: "품목명",
        qty: "수량",
        price: "단가",
        systemClosing: "시스템/마감",
        dailyClosing: "일일 마감 (Daily Closing)",
        executeClosing: "오늘 마감 실행",
        closingHistory: "마감 이력",
        backupRestore: "백업 및 복원",
        downloadBackup: "전체 백업 다운로드 (.json)",
        restoreBackup: "백업 데이터 복원",
        restoreWarning: "주의: 현재 데이터가 백업 파일의 데이터로 덮어씌워집니다.",
        todayStatus: "오늘 현황",
        closingComplete: "마감이 완료되었습니다.",
        closingExists: "이미 오늘자 마감 내역이 존재합니다.",
        backupDesc: "모든 데이터(내역, 설정, 마감기록)를 파일로 저장합니다.",
        restoreDesc: "저장된 백업 파일을 불러와 데이터를 복구합니다.",
        cat: {
            '식자재-육류': 'Food Cost - Meat',
            '식자재-수산': 'Food Cost - Seafood',
            '식자재-농산': 'Food Cost - Veg/Fruit',
            '식자재-공산품/양념': 'Food Cost - Dry Goods',
            '주류/음료': 'Beverage/Alcohol',
            '인건비-정직원': 'Labor - Salary',
            '인건비-아르바이트': 'Labor - Part-time',
            '월세': 'Rent',
            '공과금(전기/수도/가스)': 'Utilities (Elec/Water/Gas)',
            '통신/인터넷': 'Internet/Phone',
            '포장용기': 'Packaging',
            '소모품(휴지/세제)': 'Consumables',
            '유지보수/수리': 'Maintenance',
            '가스/연료': 'Gas/Fuel',
            '광고/홍보': 'Marketing',
            '세금/행정': 'Tax/Admin',
            '기타': 'Other'
        }
    },
    en: {
        headerTitle: "Kangwon Food",
        headerSubtitle: "Financial Management System",
        nav: {
            dashboard: "Dashboard",
            add: "Add",
            scan: "Scan",
            reports: "Reports",
            settings: "Settings"
        },
        sources: {
            [PaymentMethod.CASH]: "Cash (Safe)",
            [PaymentMethod.CARD]: "Corporate Card",
            [PaymentMethod.GCASH]: "G-Cash"
        },
        assetStatus: "Assets & Accounts",
        todayChange: "Today's Change",
        customerCardSales: "Customer Card Sales",
        corporateCardExpense: "Corp. Card Expense",
        cardIncome: "Card Income",
        totalIncome: "Total Income",
        totalExpense: "Total Expense",
        incomeLedger: "Income Ledger",
        expenseLedger: "Expense Ledger",
        recentTransactions: "Recent Transactions",
        recent5: "Recent 5",
        noTransactions: "No transactions.",
        addExpense: "Expense",
        addIncome: "Income",
        date: "Date",
        staff: "Staff",
        addStaff: "Add Staff",
        paymentMethod: "Payment Method",
        depositMethod: "Deposit Method",
        category: "Category",
        addCategory: "Add Category",
        description: "Description",
        incomeDescription: "Income Description",
        descPlaceholderExp: "Ex: Mart",
        descPlaceholderInc: "Ex: Dinner Sales",
        amount: "Amount (PHP)",
        depositAmount: "Deposit Amount (PHP)",
        submitExpense: "Submit Expense",
        submitIncome: "Submit Income",
        cardHelper: "* Recorded as customer card sales; offsets related expense accounts.",
        moneyHelper: "* Increases the balance of the selected fund ledger.",
        aiComplete: "AI Scan Complete",
        scanTitle: "Scan Receipt",
        scanDesc: "Upload a receipt photo to automatically extract date, amount, and details.",
        analyzing: "Analyzing...",
        uploadPhoto: "Upload Photo",
        scanError: "Failed to analyze receipt. Please try again.",
        incomeStats: "Total Income",
        expenseStats: "Total Expense",
        paymentMethodBreakdown: "Cash Flow by Method",
        income: "Income",
        expense: "Expense",
        categoryExpense: "Expense by Category",
        staffExpense: "Expense by Staff",
        allTransactions: "All Transactions",
        backOfficeBtn: "Back Office (Admin)",
        backOfficeDesc: "Ledger Management & Database",
        managePaymentMethods: "Manage Payment Methods",
        manageCategories: "Manage Categories",
        initialBalance: "Initial Balance",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        add: "Add",
        save: "Save",
        name: "Name",
        role: "Role",
        rolePlaceholder: "Ex: Manager",
        namePlaceholder: "Ex: John Doe",
        categoryNamePlaceholder: "Ex: Delivery Fee",
        sourceNamePlaceholder: "Ex: Emergency Fund",
        confirmDeleteSource: "Delete this payment method? Associated transactions will remain.",
        confirmDeleteCategory: "Delete this category?",
        confirmDeleteTx: "Delete this transaction?",
        backOfficeTitle: "Back Office (Admin)",
        backOfficeSubtitle: "Database & Ledger Management",
        downloadCsv: "Download Excel/CSV",
        journal: "Journal",
        ledger: "Ledger",
        staffManage: "Staff Management",
        type: "Type",
        proof: "Proof",
        account: "Account",
        content: "Content",
        manage: "Manage",
        selectLedger: "Select Ledger:",
        currentBalance: "Current Balance",
        initialBalItem: "Initial Balance",
        inDebit: "Debit (In)",
        outCredit: "Credit (Out)",
        balance: "Balance",
        staffList: "Staff List",
        confirmDeleteStaff: "Delete this staff member?",
        language: "Language",
        newCategory: "New Category Name",
        categoryHelper: "Use '-' for groups (e.g. Food-Meat)",
        detectedItems: "Detected Items (Editable)",
        addItem: "Add Item",
        itemName: "Item Name",
        qty: "Qty",
        price: "Price",
        systemClosing: "System Closing",
        dailyClosing: "Daily Closing",
        executeClosing: "Execute Closing",
        closingHistory: "Closing History",
        backupRestore: "Backup & Restore",
        downloadBackup: "Download Backup (.json)",
        restoreBackup: "Restore Backup",
        restoreWarning: "Warning: This will overwrite current data.",
        todayStatus: "Today's Status",
        closingComplete: "Closing complete.",
        closingExists: "Closing for today already exists.",
        backupDesc: "Save all data to a file.",
        restoreDesc: "Restore data from a backup file.",
        cat: {
            '식자재-육류': 'Food Cost - Meat',
            '식자재-수산': 'Food Cost - Seafood',
            '식자재-농산': 'Food Cost - Veg/Fruit',
            '식자재-공산품/양념': 'Food Cost - Dry Goods',
            '주류/음료': 'Beverage/Alcohol',
            '인건비-정직원': 'Labor - Salary',
            '인건비-아르바이트': 'Labor - Part-time',
            '월세': 'Rent',
            '공과금(전기/수도/가스)': 'Utilities (Elec/Water/Gas)',
            '통신/인터넷': 'Internet/Phone',
            '포장용기': 'Packaging',
            '소모품(휴지/세제)': 'Consumables',
            '유지보수/수리': 'Maintenance',
            '가스/연료': 'Gas/Fuel',
            '광고/홍보': 'Marketing',
            '세금/행정': 'Tax/Admin',
            '기타': 'Other'
        }
    }
};

// --- INITIAL DATA ---
const INITIAL_SOURCE_DEFINITIONS = [
    { id: PaymentMethod.CASH as string, name: '현금 (금고)', initialBalance: 500000 },
    { id: PaymentMethod.CARD as string, name: '법인 카드', initialBalance: 10000000 },
    { id: PaymentMethod.GCASH as string, name: 'G-Cash', initialBalance: 2000000 },
];

const INITIAL_STAFF_MEMBERS: Staff[] = [
    { id: 's1', name: '김철수', role: '점장' },
    { id: 's2', name: '이영희', role: '구매 담당' },
    { id: 's3', name: '박지민', role: '마케팅' },
];

// Detailed Restaurant Categories
const INITIAL_CATEGORIES = [
    '식자재-육류',
    '식자재-수산',
    '식자재-농산',
    '식자재-공산품/양념',
    '주류/음료',
    '인건비-정직원',
    '인건비-아르바이트',
    '월세',
    '공과금(전기/수도/가스)',
    '통신/인터넷',
    '포장용기',
    '소모품(휴지/세제)',
    '유지보수/수리',
    '가스/연료',
    '광고/홍보',
    '세금/행정',
    '기타'
];

const COLORS = ['#F97316', '#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6', '#EF4444', '#14B8A6'];

// --- APP COMPONENT ---

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [language, setLanguage] = useState<Language>('ko');

    // State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [sourceDefs, setSourceDefs] = useState(INITIAL_SOURCE_DEFINITIONS);
    const [staff, setStaff] = useState<Staff[]>(INITIAL_STAFF_MEMBERS);
    const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
    const [closingHistory, setClosingHistory] = useState<DailyClose[]>([]);

    // Scanner State
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Add Staff Modal State
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [newStaffName, setNewStaffName] = useState('');
    const [newStaffRole, setNewStaffRole] = useState('직원');

    // Category Management State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [categoryNameInput, setCategoryNameInput] = useState('');

    // Source Management Modal State
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
    const [sourceForm, setSourceForm] = useState({ name: '', initialBalance: 0 });

    // Image Preview State
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Form State (shared for manual and scan)
    const [formData, setFormData] = useState<Partial<Transaction>>({
        type: TransactionType.EXPENSE,
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        description: '',
        category: INITIAL_CATEGORIES[0],
        paymentMethod: PaymentMethod.CARD,
        staffName: INITIAL_STAFF_MEMBERS[0].name,
        items: []
    });

    // Translation Helper
    const t = (key: keyof typeof TRANSLATIONS['ko']) => TRANSLATIONS[language][key];

    // Helper for Category Translation
    const getCategoryName = (cat: string) => {
        // @ts-ignore
        const translated = TRANSLATIONS[language].cat[cat];
        return translated || cat; // Return translation if exists, else return original string
    };

    // Helper to get localized source name
    const getSourceName = (id: string, originalName: string) => {
        // If it's one of the standard IDs, return the translated name
        if (id === PaymentMethod.CASH || id === PaymentMethod.CARD || id === PaymentMethod.GCASH) {
            return TRANSLATIONS[language].sources[id as PaymentMethod];
        }
        // Otherwise return the custom name
        return originalName;
    };

    // Derived State: Calculate Balances dynamically
    const sources: (FinancialSource & { income: number, expense: number, todayChange: number })[] = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];

        return sourceDefs.map(def => {
            const sourceTransactions = transactions.filter(t => t.paymentMethod === def.id);

            const totalSpent = sourceTransactions
                .filter(t => t.type === TransactionType.EXPENSE)
                .reduce((sum, t) => sum + t.amount, 0);

            const totalIncome = sourceTransactions
                .filter(t => t.type === TransactionType.INCOME)
                .reduce((sum, t) => sum + t.amount, 0);

            // Calculate Today's Change
            const todayTx = sourceTransactions.filter(t => t.date === today);
            const todayIncome = todayTx.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
            const todayExpense = todayTx.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);

            return {
                ...def,
                balance: def.initialBalance - totalSpent + totalIncome,
                income: totalIncome,
                expense: totalSpent,
                todayChange: todayIncome - todayExpense
            };
        });
    }, [sourceDefs, transactions]);

    // --- HANDLERS ---

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.description) return;

        const isExpense = formData.type === TransactionType.EXPENSE;
        const finalCategory = isExpense
            ? (formData.category || '기타')
            : '매출'; // Default category for Income

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            date: formData.date || new Date().toISOString(),
            type: formData.type || TransactionType.EXPENSE,
            amount: Number(formData.amount),
            description: formData.description || '',
            category: finalCategory,
            paymentMethod: formData.paymentMethod || sources[0]?.id || 'UNKNOWN',
            staffName: formData.staffName || 'Unknown',
            receiptUrl: formData.receiptUrl,
            items: formData.items // Persist extracted items
        };

        setTransactions(prev => [newTransaction, ...prev]);

        // Reset Form (keep type same as last usage for convenience)
        setFormData(prev => ({
            type: prev.type,
            date: new Date().toISOString().split('T')[0],
            amount: 0,
            description: '',
            category: categories[0],
            paymentMethod: sources[0]?.id || '',
            staffName: staff[0]?.name || 'Unknown',
            receiptUrl: undefined,
            items: []
        }));

        setActiveTab('dashboard');
    };

    const handleAddStaff = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStaffName.trim()) return;

        const newMember: Staff = {
            id: `s${Date.now()}`,
            name: newStaffName,
            role: newStaffRole || '직원'
        };

        setStaff(prev => [...prev, newMember]);
        setFormData(prev => ({ ...prev, staffName: newMember.name }));

        setNewStaffName('');
        setNewStaffRole('직원');
        setShowStaffModal(false);
    };

    const openCategoryManager = () => {
        setCategoryNameInput('');
        setEditingCategory(null);
        setShowCategoryModal(true);
    };

    const handleSaveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryNameInput.trim()) return;

        if (editingCategory) {
            // Rename: Update list and all existing transactions
            setCategories(prev => prev.map(c => c === editingCategory ? categoryNameInput : c));
            setTransactions(prev => prev.map(t => t.category === editingCategory ? { ...t, category: categoryNameInput } : t));
            // If the form's selected category was the one we edited, update it too
            if (formData.category === editingCategory) {
                setFormData(prev => ({ ...prev, category: categoryNameInput }));
            }
        } else {
            // Add new
            if (!categories.includes(categoryNameInput)) {
                setCategories(prev => [...prev, categoryNameInput]);
                setFormData(prev => ({ ...prev, category: categoryNameInput }));
            }
        }

        setCategoryNameInput('');
        setEditingCategory(null);
    }

    const handleEditCategory = (cat: string) => {
        setEditingCategory(cat);
        setCategoryNameInput(cat);
    }

    const handleDeleteCategory = (cat: string) => {
        if (confirm(t('confirmDeleteCategory'))) {
            setCategories(prev => prev.filter(c => c !== cat));
            if (formData.category === cat) {
                setFormData(prev => ({ ...prev, category: categories[0] }));
            }
        }
    }

    const handleSaveSource = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceForm.name.trim()) return;

        if (editingSourceId) {
            // Update existing
            setSourceDefs(prev => prev.map(def =>
                def.id === editingSourceId
                    ? { ...def, name: sourceForm.name, initialBalance: Number(sourceForm.initialBalance) }
                    : def
            ));
        } else {
            // Add new
            setSourceDefs(prev => [...prev, {
                id: `source-${Date.now()}`,
                name: sourceForm.name,
                initialBalance: Number(sourceForm.initialBalance)
            }]);
        }

        setShowSourceModal(false);
        setEditingSourceId(null);
        setSourceForm({ name: '', initialBalance: 0 });
    };

    const openEditSource = (def: typeof sourceDefs[0]) => {
        setEditingSourceId(def.id);
        setSourceForm({ name: def.name, initialBalance: def.initialBalance });
        setShowSourceModal(true);
    };

    const openAddSource = () => {
        setEditingSourceId(null);
        setSourceForm({ name: '', initialBalance: 0 });
        setShowSourceModal(true);
    };

    const deleteSource = (id: string) => {
        if (confirm(t('confirmDeleteSource'))) {
            setSourceDefs(prev => prev.filter(d => d.id !== id));
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];

                try {
                    const receiptData = await parseReceiptImage(base64Data, file.type, categories);

                    setFormData(prev => ({
                        ...prev,
                        type: TransactionType.EXPENSE, // Receipts are usually expenses
                        amount: receiptData.totalAmount,
                        description: receiptData.merchantName,
                        date: receiptData.date || new Date().toISOString().split('T')[0],
                        category: (receiptData.category) || categories[0],
                        receiptUrl: base64String,
                        items: receiptData.items || []
                    }));

                    setActiveTab('add');
                } catch (err) {
                    alert(t('scanError'));
                } finally {
                    setIsProcessing(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    const deleteTransaction = (id: string) => {
        if (confirm(t('confirmDeleteTx'))) {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    };

    // --- ITEM MANAGEMENT HANDLERS ---
    const handleUpdateItem = (index: number, field: keyof ReceiptItem, value: any) => {
        const updatedItems = [...(formData.items || [])];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setFormData({ ...formData, items: updatedItems });
    };

    const handleDeleteItem = (index: number) => {
        const updatedItems = [...(formData.items || [])];
        updatedItems.splice(index, 1);
        setFormData({ ...formData, items: updatedItems });
    };

    const handleAddItem = () => {
        const newItem: ReceiptItem = { name: '', quantity: 1, price: 0 };
        setFormData({ ...formData, items: [...(formData.items || []), newItem] });
    };

    const getSourceIcon = (id: string) => {
        switch (id) {
            case PaymentMethod.CASH: return <Wallet size={20} />;
            case PaymentMethod.CARD: return <CreditCard size={20} />;
            case PaymentMethod.GCASH: return <Coins size={20} />;
            default: return <PiggyBank size={20} />;
        }
    };

    const downloadCSV = () => {
        const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Source', 'Staff', 'Receipt', 'Items'];
        const rows = transactions.map(t => [
            t.id,
            t.date,
            t.type,
            t.category,
            `"${t.description}"`, // Quote description to handle commas
            t.amount,
            getSourceName(t.paymentMethod, sources.find(s => s.id === t.paymentMethod)?.name || t.paymentMethod),
            t.staffName,
            t.receiptUrl ? 'Yes' : 'No',
            t.items ? `"${t.items.map(i => `${i.name} (${i.quantity}x ${i.price})`).join('; ')}"` : ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `kangwon_food_data_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleDailyClose = () => {
        const today = new Date().toISOString().split('T')[0];

        // Check if already closed today
        if (closingHistory.some(c => c.date === today)) {
            alert(t('closingExists'));
            return;
        }

        // Calculate Today's Totals
        const todayTransactions = transactions.filter(t => t.date === today);
        const todayIncome = todayTransactions.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
        const todayExpense = todayTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);

        // Snapshot Balances
        const sourceSnapshots = sources.map(s => ({
            sourceId: s.id,
            sourceName: s.name,
            balance: s.balance
        }));

        const closeRecord: DailyClose = {
            id: Date.now().toString(),
            date: today,
            totalIncome: todayIncome,
            totalExpense: todayExpense,
            sourceSnapshots: sourceSnapshots,
            createdAt: new Date().toISOString()
        };

        setClosingHistory(prev => [closeRecord, ...prev]);
        alert(t('closingComplete'));
    };

    const handleBackup = () => {
        const backupData: BackupData = {
            version: "1.0",
            timestamp: new Date().toISOString(),
            data: {
                transactions,
                sourceDefs,
                staff,
                categories,
                closingHistory
            }
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `kangwon_food_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string) as BackupData;

                if (json.data) {
                    if (confirm(t('restoreWarning'))) {
                        setTransactions(json.data.transactions || []);
                        setSourceDefs(json.data.sourceDefs || []);
                        setStaff(json.data.staff || []);
                        setCategories(json.data.categories || []);
                        setClosingHistory(json.data.closingHistory || []);
                        alert("Restored successfully!");
                    }
                } else {
                    alert("Invalid backup file format.");
                }
            } catch (err) {
                console.error(err);
                alert("Failed to parse backup file.");
            }
        };
        reader.readAsText(file);
    };

    const renderCategoryOptions = () => {
        const groups: Record<string, string[]> = {};
        const orphans: string[] = [];

        categories.forEach(c => {
            if (c.includes('-')) {
                const parts = c.split('-');
                const groupName = parts[0];
                if (!groups[groupName]) groups[groupName] = [];
                groups[groupName].push(c);
            } else {
                orphans.push(c);
            }
        });

        return (
            <>
                {orphans.map(c => <option key={c} value={c}>{getCategoryName(c)}</option>)}
                {Object.keys(groups).map(group => (
                    <optgroup key={group} label={group}>
                        {groups[group].map(c => (
                            <option key={c} value={c}>{getCategoryName(c)}</option>
                        ))}
                    </optgroup>
                ))}
            </>
        );
    };

    // --- SUB-COMPONENTS FOR VIEWS ---

    const DashboardView = () => (
        <div className="space-y-6">

            {/* 1. Account Status (Balance & Flow) */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
                    <Wallet className="mr-2 text-primary" size={20} />
                    {t('assetStatus')}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {sources.map(source => (
                        <div key={source.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                            {/* Background Decor */}
                            <div className={`absolute top-0 right-0 p-8 rounded-bl-full opacity-5 ${source.id === PaymentMethod.CASH ? 'bg-green-500' :
                                    source.id === PaymentMethod.CARD ? 'bg-blue-500' :
                                        source.id === PaymentMethod.GCASH ? 'bg-purple-500' : 'bg-orange-500'
                                }`}></div>

                            {/* Top Row: Icon, Name, Current Balance */}
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-xl shadow-sm ${source.id === PaymentMethod.CASH ? 'bg-green-100 text-green-600' :
                                            source.id === PaymentMethod.CARD ? 'bg-blue-100 text-blue-600' :
                                                source.id === PaymentMethod.GCASH ? 'bg-purple-100 text-purple-600' :
                                                    'bg-orange-100 text-orange-600'
                                        }`}>
                                        {getSourceIcon(source.id)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">
                                            {source.id === PaymentMethod.CARD ? t('cardIncome') : getSourceName(source.id, source.name)}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-800 tracking-tight">
                                            ₱{source.balance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Today's Change Indicator */}
                                <div className="text-right">
                                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">{t('todayChange')}</p>
                                    <div className={`flex items-center justify-end text-sm font-bold ${source.todayChange > 0 ? 'text-green-600' :
                                            source.todayChange < 0 ? 'text-red-500' : 'text-slate-400'
                                        }`}>
                                        {source.todayChange !== 0 && (
                                            source.todayChange > 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />
                                        )}
                                        {source.todayChange === 0 ? '-' : `₱${Math.abs(source.todayChange).toLocaleString()}`}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Detailed Ledger Stats (In/Out) */}
                            <div className="flex bg-slate-50 rounded-xl p-3 relative z-10 divide-x divide-slate-200">
                                <div className="flex-1 px-2 text-center">
                                    <p className="text-[10px] text-slate-400 mb-1">
                                        {source.id === PaymentMethod.CARD ? `${t('customerCardSales')} (+)` : `${t('totalIncome')} (+)`}
                                    </p>
                                    <p className="text-sm font-bold text-blue-600">
                                        +₱{source.income.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex-1 px-2 text-center">
                                    <p className="text-[10px] text-slate-400 mb-1">
                                        {source.id === PaymentMethod.CARD ? `${t('corporateCardExpense')} (-)` : `${t('totalExpense')} (-)`}
                                    </p>
                                    <p className="text-sm font-bold text-red-500">
                                        -₱{source.expense.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Ledger Sections (Separate Income / Expense) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Income Ledger */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-green-50 p-4 border-b border-green-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ArrowUpCircle className="text-green-600" size={20} />
                            <h3 className="font-bold text-green-800">{t('incomeLedger')}</h3>
                        </div>
                        <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-1 rounded-full">
                            Total: ₱{sources.reduce((a, b) => a + b.income, 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-50 p-2">
                        {sources.map(s => (
                            <div key={s.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="text-slate-400 scale-75">{getSourceIcon(s.id)}</div>
                                    <span className="text-sm text-slate-600 font-medium">
                                        {/* CUSTOM NAME LOGIC FOR INCOME LEDGER */}
                                        {s.id === PaymentMethod.CARD ? t('customerCardSales') : getSourceName(s.id, s.name)}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-green-600">+₱{s.income.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expense Ledger */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <ArrowDownCircle className="text-orange-600" size={20} />
                            <h3 className="font-bold text-orange-800">{t('expenseLedger')}</h3>
                        </div>
                        <span className="text-xs font-medium text-orange-700 bg-orange-200 px-2 py-1 rounded-full">
                            Total: ₱{sources.reduce((a, b) => a + b.expense, 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-50 p-2">
                        {sources.map(s => (
                            <div key={s.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="text-slate-400 scale-75">{getSourceIcon(s.id)}</div>
                                    <span className="text-sm text-slate-600 font-medium">
                                        {s.id === PaymentMethod.CARD ? t('corporateCardExpense') : getSourceName(s.id, s.name)}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-red-500">-₱{s.expense.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Recent Transactions */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center justify-between">
                    {t('recentTransactions')}
                    <span className="text-xs font-normal text-slate-400">{t('recent5')}</span>
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-50">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            {t('noTransactions')}
                        </div>
                    ) : (
                        transactions.slice(0, 5).map(t => {
                            const sourceName = getSourceName(t.paymentMethod, sources.find(s => s.id === t.paymentMethod)?.name || 'Other');
                            const isExpense = t.type === TransactionType.EXPENSE;
                            return (
                                <div key={t.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        {t.receiptUrl ? (
                                            <button onClick={() => setPreviewImage(t.receiptUrl!)} className="relative group">
                                                <img
                                                    src={t.receiptUrl}
                                                    alt="Receipt"
                                                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shadow-sm transition-transform active:scale-95"
                                                />
                                                <div className="absolute inset-0 bg-black/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ) : (
                                            <div className={`p-2 rounded-lg ${isExpense ? 'bg-orange-50' : 'bg-green-50'}`}>
                                                {isExpense
                                                    ? <TrendingDown className="text-orange-500" size={16} />
                                                    : <TrendingUp className="text-green-500" size={16} />
                                                }
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{t.description}</p>
                                            <p className="text-xs text-slate-500">{t.staffName} · {sourceName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${isExpense ? 'text-slate-800' : 'text-green-600'}`}>
                                            {isExpense ? '-' : '+'}₱{t.amount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-slate-400">{t.date}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );

    const AddExpenseView = () => {
        const isExpense = formData.type === TransactionType.EXPENSE;

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">

                {/* Toggle Type */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: TransactionType.EXPENSE })}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all ${isExpense ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'
                            }`}
                    >
                        <ArrowDownCircle size={16} />
                        <span>{t('addExpense')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: TransactionType.INCOME })}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-all ${!isExpense ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'
                            }`}
                    >
                        <ArrowUpCircle size={16} />
                        <span>{t('addIncome')}</span>
                    </button>
                </div>

                <form onSubmit={handleAddTransaction} className="space-y-4">

                    {/* Receipt Preview & Editable Items */}
                    {formData.receiptUrl && isExpense && (
                        <div className="mb-6 relative group">
                            <img src={formData.receiptUrl} alt="Receipt Preview" className="w-full h-40 object-cover rounded-lg border border-slate-200 mb-4" />
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-md">
                                <CheckCircle2 size={12} className="mr-1" /> {t('aiComplete')}
                            </div>

                            {/* EDITABLE Items List */}
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-bold text-slate-500">{t('detectedItems')}</p>
                                    <button type="button" onClick={handleAddItem} className="text-xs text-primary font-bold flex items-center">
                                        <Plus size={12} className="mr-1" /> {t('addItem')}
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {(!formData.items || formData.items.length === 0) && (
                                        <p className="text-xs text-slate-400 text-center py-2">No items detected</p>
                                    )}
                                    {formData.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                                                className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary"
                                                placeholder={t('itemName')}
                                            />
                                            <input
                                                type="number"
                                                value={item.quantity || 1}
                                                onChange={(e) => handleUpdateItem(idx, 'quantity', Number(e.target.value))}
                                                className="w-12 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-primary"
                                                placeholder={t('qty')}
                                            />
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleUpdateItem(idx, 'price', Number(e.target.value))}
                                                className="w-20 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-right focus:outline-none focus:border-primary"
                                                placeholder={t('price')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteItem(idx)}
                                                className="text-slate-400 hover:text-red-500"
                                            >
                                                <MinusCircle size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">{t('date')}</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">{t('staff')}</label>
                            <div className="flex space-x-2">
                                <select
                                    value={formData.staffName}
                                    onChange={e => setFormData({ ...formData, staffName: e.target.value })}
                                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                                >
                                    {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowStaffModal(true)}
                                    className="bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700 active:scale-95 transition-transform"
                                    title={t('addStaff')}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                {isExpense ? t('paymentMethod') : t('depositMethod')}
                            </label>
                            <select
                                value={formData.paymentMethod}
                                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                            >
                                {sources.map(source => (
                                    <option key={source.id} value={source.id}>
                                        {/* CUSTOM NAME LOGIC FOR DROPDOWN IN INCOME MODE */}
                                        {source.id === PaymentMethod.CARD && !isExpense
                                            ? t('customerCardSales')
                                            : getSourceName(source.id, source.name)}
                                    </option>
                                ))}
                            </select>
                            {isExpense ? null : (
                                <p className="text-[10px] text-slate-400 mt-1">
                                    {formData.paymentMethod === PaymentMethod.CARD
                                        ? t('cardHelper')
                                        : t('moneyHelper')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category only for Expenses */}
                    {isExpense && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">{t('category')}</label>
                            <div className="flex space-x-2">
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                                >
                                    {renderCategoryOptions()}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => openCategoryManager()}
                                    className="bg-slate-200 text-slate-600 p-3 rounded-lg hover:bg-slate-300 active:scale-95 transition-transform"
                                    title={t('manageCategories')}
                                >
                                    <FolderTree size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                            {isExpense ? t('description') : t('incomeDescription')}
                        </label>
                        <input
                            type="text"
                            placeholder={isExpense ? t('descPlaceholderExp') : t('descPlaceholderInc')}
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                            {isExpense ? t('amount') : t('depositAmount')}
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            required
                            value={formData.amount || ''}
                            onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                            className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-bold text-lg text-right ${!isExpense && 'text-green-600'}`}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform mt-4 ${isExpense ? 'bg-primary shadow-orange-200' : 'bg-green-600 shadow-green-200 hover:bg-green-700'
                            }`}
                    >
                        {isExpense ? t('submitExpense') : t('submitIncome')}
                    </button>
                </form>
            </div>
        );
    };

    const ScanView = () => (
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-6 text-center">
            <div className="bg-white p-8 rounded-full shadow-xl shadow-slate-200 relative">
                {isProcessing ? (
                    <Loader2 size={64} className="text-primary animate-spin" />
                ) : (
                    <Camera size={64} className="text-primary" />
                )}
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">{t('scanTitle')}</h2>
                <p className="text-slate-500">
                    {t('scanDesc')}
                </p>
            </div>

            <div className="w-full space-y-3">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform"
                >
                    {isProcessing ? (
                        <>
                            <span>{t('analyzing')}</span>
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            <span>{t('uploadPhoto')}</span>
                        </>
                    )}
                </button>
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </div>
        </div>
    );

    const ReportsView = () => {
        // Group by Category
        const categoryData = useMemo(() => {
            const grouping: Record<string, number> = {};
            transactions.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
                const cat = t.category;
                // Use translation for grouping display if available, otherwise raw
                const displayCat = getCategoryName(cat);
                grouping[displayCat] = (grouping[displayCat] || 0) + t.amount;
            });
            return Object.keys(grouping).map(name => ({ name, value: grouping[name] }));
        }, [transactions, language]);

        // Group by Staff
        const staffData = useMemo(() => {
            const grouping: Record<string, number> = {};
            transactions.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
                grouping[t.staffName] = (grouping[t.staffName] || 0) + t.amount;
            });
            return Object.keys(grouping).map(name => ({ name, value: grouping[name] }));
        }, [transactions]);

        // Calculate income and expense per source
        const paymentStats = useMemo(() => {
            return sources.map(source => {
                const sourceTransactions = transactions.filter(t => t.paymentMethod === source.id);
                const income = sourceTransactions
                    .filter(t => t.type === TransactionType.INCOME)
                    .reduce((sum, t) => sum + t.amount, 0);
                const expense = sourceTransactions
                    .filter(t => t.type === TransactionType.EXPENSE)
                    .reduce((sum, t) => sum + t.amount, 0);

                return {
                    ...source,
                    income,
                    expense
                };
            });
        }, [sources, transactions]);

        const totalExpense = transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((acc, cur) => acc + cur.amount, 0);

        const totalIncome = transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((acc, cur) => acc + cur.amount, 0);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">{t('incomeStats')}</h3>
                        <p className="text-2xl font-bold text-green-600">₱{totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">{t('expenseStats')}</h3>
                        <p className="text-2xl font-bold text-slate-800">₱{totalExpense.toLocaleString()}</p>
                    </div>
                </div>

                {/* Payment Method Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{t('paymentMethodBreakdown')}</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {paymentStats.map(stat => (
                            <div key={stat.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-slate-500">
                                            {getSourceIcon(stat.id)}
                                        </div>
                                        <span className="font-semibold text-slate-700">
                                            {stat.id === PaymentMethod.CARD ? `${t('customerCardSales')} (${t('corporateCardExpense')})` : getSourceName(stat.id, stat.name)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <div className="text-blue-600 flex items-center">
                                        <span className="text-xs mr-1">{t('income')}</span>
                                        <span className="font-bold">+{stat.income.toLocaleString()}</span>
                                    </div>
                                    <div className="w-px bg-slate-200 mx-2"></div>
                                    <div className="text-red-500 flex items-center">
                                        <span className="text-xs mr-1">{t('expense')}</span>
                                        <span className="font-bold">-{stat.expense.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{t('categoryExpense')}</h3>
                    <div className="h-64">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-400">데이터가 없습니다</div>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {categoryData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center text-xs">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-slate-600 flex-1 truncate pr-2" title={entry.name}>{entry.name}</span>
                                <span className="font-bold text-slate-800">{Math.round((entry.value / totalExpense) * 100)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">{t('staffExpense')}</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={staffData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 12 }} />
                                <RechartsTooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                                <Bar dataKey="value" fill="#F97316" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* List View with Delete */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-800 p-4 border-b border-slate-100">{t('allTransactions')}</h3>
                    <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
                        {transactions.map(t => {
                            const sourceName = getSourceName(t.paymentMethod, sources.find(s => s.id === t.paymentMethod)?.name || 'Other');
                            const isExpense = t.type === TransactionType.EXPENSE;
                            const displayCat = getCategoryName(t.category);
                            return (
                                <div key={t.id} className="p-4 flex justify-between items-center group">
                                    <div className="flex items-center space-x-3">
                                        {t.receiptUrl ? (
                                            <button onClick={() => setPreviewImage(t.receiptUrl!)} className="relative group/btn">
                                                <img
                                                    src={t.receiptUrl}
                                                    alt="Receipt"
                                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-sm"
                                                />
                                            </button>
                                        ) : (
                                            <div className={`p-1.5 rounded-full ${isExpense ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                {isExpense ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{t.description}</p>
                                            <p className="text-xs text-slate-500">{t.date} · {t.staffName}</p>
                                            {isExpense && <p className="text-[10px] text-orange-500 mt-0.5">{displayCat}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`font-bold ${isExpense ? 'text-slate-800' : 'text-green-600'}`}>
                                            {isExpense ? '-' : '+'}₱{t.amount.toLocaleString()}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-500 hidden sm:inline-block">{sourceName}</span>
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const SettingsView = () => (
        <div className="space-y-6">
            {/* Language Toggle */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <Globe className="mr-2" size={24} />
                    {t('language')}
                </h2>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setLanguage('ko')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'ko' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
                            }`}
                    >
                        한국어
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'
                            }`}
                    >
                        English
                    </button>
                </div>
            </div>

            <button
                onClick={() => setActiveTab('backoffice')}
                className="w-full bg-slate-800 text-white p-6 rounded-xl shadow-lg flex items-center justify-between group active:scale-95 transition-all"
            >
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-slate-600 transition-colors">
                        <Building2 size={24} />
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-bold">{t('backOfficeBtn')}</h2>
                        <p className="text-sm text-slate-400">{t('backOfficeDesc')}</p>
                    </div>
                </div>
                <ArrowLeft className="rotate-180" />
            </button>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">{t('manageCategories')}</h2>
                    <button
                        onClick={openCategoryManager}
                        className="bg-primary text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors"
                    >
                        <List size={20} />
                    </button>
                </div>
                <div className="text-sm text-slate-400">
                    <p>{t('categoryHelper')}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">{t('managePaymentMethods')}</h2>
                    <button
                        onClick={openAddSource}
                        className="bg-primary text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="space-y-3">
                    {sourceDefs.map(def => (
                        <div key={def.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center space-x-3">
                                <div className="text-slate-500 bg-white p-2 rounded-full border border-slate-100">
                                    {getSourceIcon(def.id)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{getSourceName(def.id, def.name)}</p>
                                    <p className="text-xs text-slate-500">{t('initialBalance')}: ₱{def.initialBalance.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => openEditSource(def)}
                                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => deleteSource(def.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const BackOfficeView = () => {
        const [boTab, setBoTab] = useState<'journal' | 'ledger' | 'staff' | 'closing'>('journal');
        const [selectedSourceId, setSelectedSourceId] = useState(sources[0]?.id || '');

        // Ledger Running Balance Logic
        const ledgerData = useMemo(() => {
            if (!selectedSourceId) return [];
            const sourceDef = sourceDefs.find(s => s.id === selectedSourceId);
            if (!sourceDef) return [];

            const filtered = transactions
                .filter(t => t.paymentMethod === selectedSourceId)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            let currentBalance = sourceDef.initialBalance;

            // Add initial balance row
            const rows = [{
                id: 'init',
                date: '-',
                description: t('initialBalItem'),
                in: 0,
                out: 0,
                balance: currentBalance,
                type: 'INIT',
                receiptUrl: undefined,
                items: [] as any[]
            }];

            filtered.forEach(t => {
                const isIncome = t.type === TransactionType.INCOME;
                if (isIncome) currentBalance += t.amount;
                else currentBalance -= t.amount;

                rows.push({
                    id: t.id,
                    date: t.date,
                    description: t.description,
                    in: isIncome ? t.amount : 0,
                    out: !isIncome ? t.amount : 0,
                    balance: currentBalance,
                    type: t.type,
                    receiptUrl: t.receiptUrl,
                    items: t.items
                });
            });

            return rows.reverse(); // Show newest first for table
        }, [transactions, selectedSourceId, sourceDefs, language]);

        // Today's Closing Status Logic
        const today = new Date().toISOString().split('T')[0];
        const todayTx = transactions.filter(t => t.date === today);
        const todayIn = todayTx.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0);
        const todayOut = todayTx.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0);
        const isClosedToday = closingHistory.some(c => c.date === today);

        return (
            <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in slide-in-from-right duration-200">
                {/* BO Header */}
                <div className="bg-slate-900 text-white p-4 shadow-md flex items-center justify-between shrink-0">
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setActiveTab('settings')} className="hover:bg-slate-700 p-2 rounded-lg transition-colors">
                            <ArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold">{t('backOfficeTitle')}</h1>
                            <p className="text-xs text-slate-400">{t('backOfficeSubtitle')}</p>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={downloadCSV} className="flex items-center space-x-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-bold">
                            <FileSpreadsheet size={16} />
                            <span>{t('downloadCsv')}</span>
                        </button>
                    </div>
                </div>

                {/* BO Navigation */}
                <div className="flex bg-white border-b border-slate-200 overflow-x-auto shrink-0">
                    <button
                        onClick={() => setBoTab('journal')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-6 ${boTab === 'journal' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Table2 size={18} />
                            <span>{t('journal')}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setBoTab('ledger')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-6 ${boTab === 'ledger' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Building2 size={18} />
                            <span>{t('ledger')}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setBoTab('staff')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-6 ${boTab === 'staff' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Users size={18} />
                            <span>{t('staffManage')}</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setBoTab('closing')}
                        className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-6 ${boTab === 'closing' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Save size={18} />
                            <span>{t('systemClosing')}</span>
                        </div>
                    </button>
                </div>

                {/* BO Content */}
                <div className="flex-1 overflow-auto p-4">
                    {boTab === 'journal' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                        <tr>
                                            <th className="p-4 whitespace-nowrap">{t('date')}</th>
                                            <th className="p-4 whitespace-nowrap">{t('type')}</th>
                                            <th className="p-4 whitespace-nowrap text-center">{t('proof')}</th>
                                            <th className="p-4 whitespace-nowrap">{t('account')}</th>
                                            <th className="p-4 whitespace-nowrap">{t('category')}</th>
                                            <th className="p-4 w-full">{t('content')}</th>
                                            <th className="p-4 whitespace-nowrap text-right">{t('amount')}</th>
                                            <th className="p-4 whitespace-nowrap">{t('staff')}</th>
                                            <th className="p-4 whitespace-nowrap">{t('manage')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {transactions.map(t => (
                                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 whitespace-nowrap text-slate-600">{t.date}</td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.type === TransactionType.EXPENSE ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                        {t.type === TransactionType.EXPENSE ? t('expense') : t('income')}
                                                    </span>
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-center">
                                                    {t.receiptUrl ? (
                                                        <button onClick={() => setPreviewImage(t.receiptUrl!)} className="hover:opacity-80 transition-opacity">
                                                            <img src={t.receiptUrl} alt="Receipt" className="w-8 h-8 rounded-md object-cover border border-slate-200" />
                                                        </button>
                                                    ) : <span className="text-slate-300">-</span>}
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-slate-600">
                                                    {getSourceName(t.paymentMethod, sources.find(s => s.id === t.paymentMethod)?.name || t.paymentMethod)}
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-slate-600">{getCategoryName(t.category)}</td>
                                                <td className="p-4 font-medium text-slate-800">
                                                    <div>{t.description}</div>
                                                    {t.items && t.items.length > 0 && (
                                                        <div className="text-xs text-slate-400 mt-1">
                                                            {t.items.length} items detected
                                                        </div>
                                                    )}
                                                </td>
                                                <td className={`p-4 whitespace-nowrap text-right font-bold ${t.type === TransactionType.EXPENSE ? 'text-slate-800' : 'text-green-600'}`}>
                                                    {t.type === TransactionType.EXPENSE ? '-' : '+'}₱{t.amount.toLocaleString()}
                                                </td>
                                                <td className="p-4 whitespace-nowrap text-slate-600">{t.staffName}</td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <button onClick={() => deleteTransaction(t.id)} className="text-slate-400 hover:text-red-500">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {transactions.length === 0 && (
                                            <tr>
                                                <td colSpan={9} className="p-8 text-center text-slate-400">{t('noTransactions')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {boTab === 'ledger' && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-slate-200 w-full md:w-auto">
                                <span className="text-sm font-semibold text-slate-500 whitespace-nowrap px-2">{t('selectLedger')}</span>
                                <select
                                    value={selectedSourceId}
                                    onChange={(e) => setSelectedSourceId(e.target.value)}
                                    className="flex-1 bg-transparent font-bold text-slate-800 focus:outline-none"
                                >
                                    {sources.map(s => (
                                        <option key={s.id} value={s.id}>{getSourceName(s.id, s.name)} ({t('currentBalance')}: ₱{s.balance.toLocaleString()})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                            <tr>
                                                <th className="p-4 whitespace-nowrap">{t('date')}</th>
                                                <th className="p-4 w-full">{t('content')}</th>
                                                <th className="p-4 whitespace-nowrap text-right text-green-600">{t('inDebit')}</th>
                                                <th className="p-4 whitespace-nowrap text-right text-red-500">{t('outCredit')}</th>
                                                <th className="p-4 whitespace-nowrap text-right">{t('balance')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {ledgerData.map((row) => (
                                                <tr key={row.id} className={`${row.id === 'init' ? 'bg-slate-50 font-bold' : 'hover:bg-slate-50'} transition-colors`}>
                                                    <td className="p-4 whitespace-nowrap text-slate-600">{row.date}</td>
                                                    <td className="p-4 text-slate-800">
                                                        <div className="flex items-center space-x-2">
                                                            {row.receiptUrl && (
                                                                <button onClick={() => setPreviewImage(row.receiptUrl!)} className="hover:opacity-80">
                                                                    <ImageIcon size={16} className="text-slate-400" />
                                                                </button>
                                                            )}
                                                            <div>
                                                                <div>{row.description}</div>
                                                                {/* @ts-ignore */}
                                                                {row.items && row.items.length > 0 && (
                                                                    <div className="text-xs text-slate-400">({row.items.length} items)</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap text-right text-green-600 font-medium">
                                                        {row.in > 0 ? `+₱${row.in.toLocaleString()}` : '-'}
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap text-right text-red-500 font-medium">
                                                        {row.out > 0 ? `-₱${row.out.toLocaleString()}` : '-'}
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap text-right font-bold text-slate-800">
                                                        ₱{row.balance.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {boTab === 'staff' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-800">{t('staffList')}</h2>
                                <button
                                    onClick={() => setShowStaffModal(true)}
                                    className="bg-primary text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {staff.map(s => (
                                    <div key={s.id} className="py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-slate-800">{s.name}</p>
                                            <p className="text-sm text-slate-400">{s.role}</p>
                                        </div>
                                        <button onClick={() => {
                                            if (confirm(t('confirmDeleteStaff'))) {
                                                setStaff(prev => prev.filter(st => st.id !== s.id));
                                            }
                                        }} className="text-slate-300 hover:text-red-500 p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {boTab === 'closing' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* 1. Daily Closing Action */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">{t('dailyClosing')}</h3>
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{today}</span>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">{t('todayStatus')} ({t('income')})</span>
                                        <span className="font-bold text-green-600">+₱{todayIn.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">{t('todayStatus')} ({t('expense')})</span>
                                        <span className="font-bold text-red-500">-₱{todayOut.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDailyClose}
                                    disabled={isClosedToday}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${isClosedToday
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-orange-600 shadow-lg'
                                        }`}
                                >
                                    {isClosedToday ? <CheckCircle2 size={20} /> : <Save size={20} />}
                                    <span>{isClosedToday ? t('closingComplete') : t('executeClosing')}</span>
                                </button>
                            </div>

                            {/* 2. Backup & Restore */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">{t('backupRestore')}</h3>

                                <div className="space-y-4">
                                    <div>
                                        <button
                                            onClick={handleBackup}
                                            className="w-full py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-2 transition-colors"
                                        >
                                            <Download size={18} />
                                            <span>{t('downloadBackup')}</span>
                                        </button>
                                        <p className="text-xs text-slate-400 mt-2 text-center">{t('backupDesc')}</p>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4">
                                        <label className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-700 cursor-pointer transition-colors">
                                            <RotateCcw size={18} />
                                            <span>{t('restoreBackup')}</span>
                                            <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
                                        </label>
                                        <p className="text-xs text-slate-400 mt-2 text-center">{t('restoreDesc')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Closing History */}
                            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">{t('closingHistory')}</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-semibold">
                                            <tr>
                                                <th className="p-3">{t('date')}</th>
                                                <th className="p-3 text-right text-green-600">{t('income')}</th>
                                                <th className="p-3 text-right text-red-500">{t('expense')}</th>
                                                <th className="p-3 text-right text-slate-800">{t('balance')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {closingHistory.length === 0 ? (
                                                <tr><td colSpan={4} className="p-6 text-center text-slate-400">No closing history</td></tr>
                                            ) : closingHistory.map(h => (
                                                <tr key={h.id} className="hover:bg-slate-50">
                                                    <td className="p-3 font-medium text-slate-700">{h.date}</td>
                                                    <td className="p-3 text-right font-medium text-green-600">+₱{h.totalIncome.toLocaleString()}</td>
                                                    <td className="p-3 text-right font-medium text-red-500">-₱{h.totalExpense.toLocaleString()}</td>
                                                    <td className="p-3 text-right font-bold text-slate-800">
                                                        ₱{h.sourceSnapshots.reduce((acc, s) => acc + s.balance, 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Layout
            activeTab={activeTab === 'backoffice' ? 'settings' : activeTab}
            onTabChange={setActiveTab}
            labels={{
                headerTitle: t('headerTitle'),
                headerSubtitle: t('headerSubtitle'),
                nav: TRANSLATIONS[language].nav
            }}
        >
            {/* 
        Changes made here:
        Instead of rendering <DashboardView /> (component), we call DashboardView() (function).
        This prevents React from unmounting/remounting the inputs on every re-render of App, 
        which was causing focus loss in text inputs.
      */}
            {activeTab === 'dashboard' && DashboardView()}
            {activeTab === 'add' && AddExpenseView()}
            {activeTab === 'scan' && ScanView()}

            {/* 
        ReportsView and BackOfficeView MUST be rendered as components <...> because they contain hooks.
        If called as functions, they would violate Rules of Hooks (conditional execution).
        They don't have the input focus issue since they don't share state that causes re-render while typing.
      */}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'settings' && SettingsView()}
            {activeTab === 'backoffice' && <BackOfficeView />}

            {/* Add Staff Modal */}
            {showStaffModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowStaffModal(false)} />
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 z-10 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{t('addStaff')}</h3>
                        <form onSubmit={handleAddStaff}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t('name')}</label>
                                    <input
                                        value={newStaffName}
                                        onChange={e => setNewStaffName(e.target.value)}
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder={t('namePlaceholder')}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t('role')}</label>
                                    <input
                                        value={newStaffRole}
                                        onChange={e => setNewStaffRole(e.target.value)}
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder={t('rolePlaceholder')}
                                    />
                                </div>
                                <div className="flex space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowStaffModal(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                                    >
                                        {t('add')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Management Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)} />
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h3 className="text-lg font-bold text-slate-800">{t('manageCategories')}</h3>
                            <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveCategory} className="mb-4 shrink-0">
                            <div className="flex gap-2">
                                <input
                                    value={categoryNameInput}
                                    onChange={e => setCategoryNameInput(e.target.value)}
                                    className="flex-1 border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    placeholder={t('newCategory')}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-4 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                                >
                                    {editingCategory ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                                </button>
                            </div>
                            {editingCategory && (
                                <p className="text-xs text-orange-500 mt-1 ml-1">{t('edit')}: {editingCategory}</p>
                            )}
                        </form>

                        {/* List */}
                        <div className="overflow-y-auto flex-1 border border-slate-100 rounded-xl divide-y divide-slate-50">
                            {categories.map(cat => (
                                <div key={cat} className="p-3 flex items-center justify-between hover:bg-slate-50">
                                    <div className="text-sm font-medium text-slate-700">
                                        {getCategoryName(cat)}
                                        {getCategoryName(cat) !== cat && <span className="text-xs text-slate-400 block">{cat}</span>}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => handleEditCategory(cat)}
                                            className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(cat)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Source Management Modal */}
            {showSourceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSourceModal(false)} />
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 z-10 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{editingSourceId ? t('edit') : t('add')}</h3>
                        <form onSubmit={handleSaveSource}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t('name')}</label>
                                    <input
                                        value={sourceForm.name}
                                        onChange={e => setSourceForm({ ...sourceForm, name: e.target.value })}
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder={t('sourceNamePlaceholder')}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">{t('initialBalance')} (PHP)</label>
                                    <input
                                        type="number"
                                        value={sourceForm.initialBalance}
                                        onChange={e => setSourceForm({ ...sourceForm, initialBalance: Number(e.target.value) })}
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="flex space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowSourceModal(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                                    >
                                        {editingSourceId ? t('edit') : t('add')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
                    <div className="relative w-full max-w-3xl max-h-[90vh] flex items-center justify-center">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={previewImage}
                            alt="Receipt Full Preview"
                            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
                        />
                    </div>
                </div>
            )}

        </Layout>
    );
}
