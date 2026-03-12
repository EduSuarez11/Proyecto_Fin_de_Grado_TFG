import { create } from 'zustand';

const useGlobalState = create(
    (get, set, store) => {
        return {
            clientData: null,
            chosenProduct: null,

            setClientData: (newData) => {
                set(oldData => ({
                    ...oldData,
                    clientData: {
                        ...oldData.clientData,
                        ...clientData
                    }
                }))

            },

            setChosenProduct: (newData) => {
                set(oldData => ({
                    ...oldData,
                    chosenProduct: {
                        ...oldData.chosenProduct,
                        ...newData
                    }
                }))
            }
        }
    }

)

export default useGlobalState;
