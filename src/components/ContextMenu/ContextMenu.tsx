import Button from "components/Button";
import Icon from "components/Icon";
import SROnly from "components/SROnly";
import useOnOutsideClick from "hooks/useOnOutsideClick";
import {
  Children,
  cloneElement,
  ComponentPropsWithoutRef,
  ReactNode,
  useRef,
  useState,
} from "react";
import { Tooltip } from "react-tippy";

type Props = {
  children: ReactNode;
};

const ContextMenu = ({ children }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null!);
  const [isOpen, setIsOpen] = useState(false);

  useOnOutsideClick(menuRef, () => setIsOpen(false));

  return (
    <Tooltip
      interactive
      html={
        <div ref={menuRef} className="flex flex-col py-2 space-y-2">
          {Children.map(children, (child) =>
            // @ts-expect-error
            cloneElement(child, {
              onClick() {
                // @ts-expect-error
                child.props.onClick();
                setIsOpen(false);
              },
            })
          )}
        </div>
      }
      position="bottom-end"
      trigger="click"
      theme="light"
      open={isOpen}
    >
      <Button theme="link--muted" onClick={() => setIsOpen(!isOpen)}>
        <Icon variant="fa-ellipsis-v" />
        <SROnly>Group actions</SROnly>
      </Button>
    </Tooltip>
  );
};

ContextMenu.Action = (props: ComponentPropsWithoutRef<"button">) => {
  return (
    <button
      className="text-right px-2 text-gray-600 hover:text-primary-600"
      {...props}
    />
  );
};

export default ContextMenu;
