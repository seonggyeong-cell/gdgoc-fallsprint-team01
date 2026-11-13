import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
    onClose: () => void;
    onConfirm: () => void;
}

export const WithdrawModal: React.FC<Props> = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-neutral-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 모달 헤더 */}
                <div className="p-5 border-b border-neutral-200 bg-red-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                            <h2 className="text-base font-bold text-neutral-900">회원 탈퇴</h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* 모달 본문 */}
                <div className="p-5 space-y-4">
                    <p className="text-sm text-neutral-700">
                        정말 스쿨모아에서 탈퇴하시겠습니까?<br />
                        탈퇴 시 저장된 모든 맞춤 설정 및 활동 내역이 <strong className="text-red-600">영구적으로 삭제되며 복구할 수 없습니다.</strong>
                    </p>
                </div>

                {/* 하단 버튼 */}
                <div className="p-5 pt-3 border-t border-neutral-200 flex justify-end gap-2 bg-neutral-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-neutral-600 hover:text-neutral-900 bg-neutral-100 rounded-lg font-medium cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium cursor-pointer"
                    >
                        탈퇴하기
                    </button>
                </div>
            </div>
        </div>
    );
};