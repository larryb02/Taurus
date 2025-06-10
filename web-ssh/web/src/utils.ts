export const updateField = <T extends Object>(
    collection: any,
    setter: React.Dispatch<React.SetStateAction<T>>,
    field: string,
    value: string) => {
    setter({ ...collection, [field]: value });
    console.log(collection);
}