export default function ClearStyleAttribute(element?:Element | null) {
    element?.setAttribute("style", "");
}