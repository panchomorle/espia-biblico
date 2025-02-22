import { Category, CategoryName } from "../lib/types"

interface Props{
    categories: Category[];
    setCategories: (categories: Category[]) => void;
}

function CategorySelector({ categories, setCategories }: Props) {

    const handleToggle = (name: CategoryName) => {
        const newCategories = categories.map((c) => {
            if (c.name === name){
                return {
                    ...c,
                    enabled: !c.enabled
                }
            }
            return c;
        })
        setCategories(newCategories);
    }


  return (
    <div>
    <h2 className="font-bold">Categorías</h2>
    <div className="w-full h-full flex flex-wrap justify-center p-4">
        
        { categories.map((c) => (
            <div key={c.name} className={`w-full sm:w-1/3 transition-all duration-200 ease-in ${c.enabled ? c.enabled_color : c.disabled_color}
            hover:border-4 hover:border-white focus:outline-none focus:ring-0`}>
                <button
                onClick={()=> handleToggle(c.name)}>
                    <div className="w-full p-2 text-wrap " >
                    <label>{c.name}</label>
                    </div>
                </button> 
            </div>
        )
        )}
    </div>
    </div>
  )
}

export default CategorySelector