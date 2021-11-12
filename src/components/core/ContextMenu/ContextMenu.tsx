import Button from "components/core/Button";
import Icon, { VerticalEllipses } from "components/core/Icon";
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
        <div
          ref={menuRef}
          className="flex flex-col space-y-2 bg-primary-50 rounded-lg py-4 px-8 shadow"
        >
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
      <Button
        display="flex"
        aria-label="Group actions"
        theme="link--muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon strokeWidth={3} size={16} icon={VerticalEllipses} />
      </Button>
    </Tooltip>
  );
};

ContextMenu.Action = (props: ComponentPropsWithoutRef<"button">) => {
  return (
    <button
      className="text-right text-gray-600 hover:text-primary-600"
      {...props}
    />
  );
};

export default ContextMenu;
