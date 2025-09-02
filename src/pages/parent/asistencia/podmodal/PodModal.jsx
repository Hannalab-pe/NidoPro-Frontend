import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function PodModal({ isOpen, onClose, day }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Detalle de Asistencia
                </Dialog.Title>
                {day && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xl">
                      <span>{day.emoji}</span>
                      <span className="font-bold">Día {day.date}</span>
                    </div>
                    <div className="text-base">
                      Estado: <span className="font-semibold">
                        {day.status === 'present' ? 'Asistió' : 'No asistió'}
                        {day.status === 'absent' && <span className="ml-2 text-red-600">Faltó</span>}
                      </span>
                    </div>
                    <div className="text-sm bg-gray-50 rounded p-2 mt-2">
                      <span className="font-semibold">Observación:</span> {day.reason ? day.reason : 'Sin observación'}
                    </div>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="mt-6 w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Cerrar
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
