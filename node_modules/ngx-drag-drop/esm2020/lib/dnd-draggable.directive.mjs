import { Directive, EventEmitter, forwardRef, HostBinding, HostListener, Inject, Input, Output } from "@angular/core";
import { calculateDragImageOffset, setDragData, setDragImage } from "./dnd-utils";
import { dndState, endDrag, startDrag } from "./dnd-state";
import * as i0 from "@angular/core";
export class DndDragImageRefDirective {
    constructor(parent, elementRef) {
        parent.registerDragImage(elementRef);
    }
}
DndDragImageRefDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: DndDragImageRefDirective, deps: [{ token: forwardRef(() => DndDraggableDirective) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
DndDragImageRefDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0", type: DndDragImageRefDirective, selector: "[dndDragImageRef]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: DndDragImageRefDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[dndDragImageRef]"
                }]
        }], ctorParameters: function () { return [{ type: DndDraggableDirective, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => DndDraggableDirective)]
                }] }, { type: i0.ElementRef }]; } });
export class DndDraggableDirective {
    constructor(elementRef, renderer, ngZone) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.dndEffectAllowed = "copy";
        this.dndDraggingClass = "dndDragging";
        this.dndDraggingSourceClass = "dndDraggingSource";
        this.dndDraggableDisabledClass = "dndDraggableDisabled";
        this.dndDragImageOffsetFunction = calculateDragImageOffset;
        this.dndStart = new EventEmitter();
        this.dndDrag = new EventEmitter();
        this.dndEnd = new EventEmitter();
        this.dndMoved = new EventEmitter();
        this.dndCopied = new EventEmitter();
        this.dndLinked = new EventEmitter();
        this.dndCanceled = new EventEmitter();
        this.draggable = true;
        this.isDragStarted = false;
        this.dragEventHandler = (event) => this.onDrag(event);
    }
    set dndDisableIf(value) {
        this.draggable = !value;
        if (this.draggable) {
            this.renderer.removeClass(this.elementRef.nativeElement, this.dndDraggableDisabledClass);
        }
        else {
            this.renderer.addClass(this.elementRef.nativeElement, this.dndDraggableDisabledClass);
        }
    }
    set dndDisableDragIf(value) {
        this.dndDisableIf = value;
    }
    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this.elementRef.nativeElement.addEventListener("drag", this.dragEventHandler);
        });
    }
    ngOnDestroy() {
        this.elementRef.nativeElement.removeEventListener("drag", this.dragEventHandler);
        if (this.isDragStarted === true) {
            endDrag();
        }
    }
    onDragStart(event) {
        if (this.draggable === false) {
            return false;
        }
        // check if there is dnd handle and if the dnd handle was used to start the drag
        if (typeof this.dndHandle !== "undefined"
            && typeof event._dndUsingHandle === "undefined") {
            return false;
        }
        // initialize global state
        startDrag(event, this.dndEffectAllowed, this.dndType);
        this.isDragStarted = true;
        setDragData(event, { data: this.dndDraggable, type: this.dndType }, dndState.effectAllowed);
        this.dragImage = this.determineDragImage();
        // set dragging css class prior to setDragImage so styles are applied before
        // TODO breaking change: add class to elementRef rather than drag image which could be another element
        this.renderer.addClass(this.dragImage, this.dndDraggingClass);
        // set custom dragimage if present
        // set dragimage if drag is started from dndHandle
        if (typeof this.dndDragImageElementRef !== "undefined"
            || typeof event._dndUsingHandle !== "undefined") {
            setDragImage(event, this.dragImage, this.dndDragImageOffsetFunction);
        }
        // add dragging source css class on first drag event
        const unregister = this.renderer.listen(this.elementRef.nativeElement, "drag", () => {
            this.renderer.addClass(this.elementRef.nativeElement, this.dndDraggingSourceClass);
            unregister();
        });
        this.dndStart.emit(event);
        event.stopPropagation();
        return true;
    }
    onDrag(event) {
        this.dndDrag.emit(event);
    }
    onDragEnd(event) {
        // get drop effect from custom stored state as its not reliable across browsers
        const dropEffect = dndState.dropEffect;
        let dropEffectEmitter;
        switch (dropEffect) {
            case "copy":
                dropEffectEmitter = this.dndCopied;
                break;
            case "link":
                dropEffectEmitter = this.dndLinked;
                break;
            case "move":
                dropEffectEmitter = this.dndMoved;
                break;
            default:
                dropEffectEmitter = this.dndCanceled;
                break;
        }
        dropEffectEmitter.emit(event);
        this.dndEnd.emit(event);
        // reset global state
        endDrag();
        this.isDragStarted = false;
        this.renderer.removeClass(this.dragImage, this.dndDraggingClass);
        // IE9 special hammering
        window.setTimeout(() => {
            this.renderer.removeClass(this.elementRef.nativeElement, this.dndDraggingSourceClass);
        }, 0);
        event.stopPropagation();
    }
    registerDragHandle(handle) {
        this.dndHandle = handle;
    }
    registerDragImage(elementRef) {
        this.dndDragImageElementRef = elementRef;
    }
    determineDragImage() {
        // evaluate custom drag image existence
        if (typeof this.dndDragImageElementRef !== "undefined") {
            return this.dndDragImageElementRef.nativeElement;
        }
        else {
            return this.elementRef.nativeElement;
        }
    }
}
DndDraggableDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: DndDraggableDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
DndDraggableDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0", type: DndDraggableDirective, selector: "[dndDraggable]", inputs: { dndDraggable: "dndDraggable", dndEffectAllowed: "dndEffectAllowed", dndType: "dndType", dndDraggingClass: "dndDraggingClass", dndDraggingSourceClass: "dndDraggingSourceClass", dndDraggableDisabledClass: "dndDraggableDisabledClass", dndDragImageOffsetFunction: "dndDragImageOffsetFunction", dndDisableIf: "dndDisableIf", dndDisableDragIf: "dndDisableDragIf" }, outputs: { dndStart: "dndStart", dndDrag: "dndDrag", dndEnd: "dndEnd", dndMoved: "dndMoved", dndCopied: "dndCopied", dndLinked: "dndLinked", dndCanceled: "dndCanceled" }, host: { listeners: { "dragstart": "onDragStart($event)", "dragend": "onDragEnd($event)" }, properties: { "attr.draggable": "this.draggable" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0", ngImport: i0, type: DndDraggableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[dndDraggable]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { dndDraggable: [{
                type: Input
            }], dndEffectAllowed: [{
                type: Input
            }], dndType: [{
                type: Input
            }], dndDraggingClass: [{
                type: Input
            }], dndDraggingSourceClass: [{
                type: Input
            }], dndDraggableDisabledClass: [{
                type: Input
            }], dndDragImageOffsetFunction: [{
                type: Input
            }], dndStart: [{
                type: Output
            }], dndDrag: [{
                type: Output
            }], dndEnd: [{
                type: Output
            }], dndMoved: [{
                type: Output
            }], dndCopied: [{
                type: Output
            }], dndLinked: [{
                type: Output
            }], dndCanceled: [{
                type: Output
            }], draggable: [{
                type: HostBinding,
                args: ["attr.draggable"]
            }], dndDisableIf: [{
                type: Input
            }], dndDisableDragIf: [{
                type: Input
            }], onDragStart: [{
                type: HostListener,
                args: ["dragstart", ["$event"]]
            }], onDragEnd: [{
                type: HostListener,
                args: ["dragend", ["$event"]]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLWRyYWdnYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9kbmQvc3JjL2xpYi9kbmQtZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUVULFlBQVksRUFDWixVQUFVLEVBQ1YsV0FBVyxFQUNYLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUdMLE1BQU0sRUFFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsd0JBQXdCLEVBQXdDLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFeEgsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDOztBQU0zRCxNQUFNLE9BQU8sd0JBQXdCO0lBRW5DLFlBQTZELE1BQTZCLEVBQUUsVUFBcUI7UUFDL0csTUFBTSxDQUFDLGlCQUFpQixDQUFFLFVBQVUsQ0FBRSxDQUFDO0lBQ3pDLENBQUM7O3FIQUpVLHdCQUF3QixrQkFFZixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUM7eUdBRmhELHdCQUF3QjsyRkFBeEIsd0JBQXdCO2tCQUhwQyxTQUFTO21CQUFFO29CQUNWLFFBQVEsRUFBRSxtQkFBbUI7aUJBQzlCOzBEQUdzRSxxQkFBcUI7MEJBQTdFLE1BQU07MkJBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDOztBQVE3RCxNQUFNLE9BQU8scUJBQXFCO0lBNkVoQyxZQUFxQixVQUFxQixFQUNyQixRQUFrQixFQUNsQixNQUFhO1FBRmIsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUNyQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLFdBQU0sR0FBTixNQUFNLENBQU87UUF6RWxDLHFCQUFnQixHQUFpQixNQUFNLENBQUM7UUFNeEMscUJBQWdCLEdBQUcsYUFB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QUMsYUFBYSxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQzs7a0hBdk5VLHFCQUFxQjtzR0FBckIscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBSGpDLFNBQVM7bUJBQUU7b0JBQ1YsUUFBUSxFQUFFLGdCQUFnQjtpQkFDM0I7OElBSUMsWUFBWTtzQkFEWCxLQUFLO2dCQUlOLGdCQUFnQjtzQkFEZixLQUFLO2dCQUlOLE9BQU87c0JBRE4sS0FBSztnQkFJTixnQkFBZ0I7c0JBRGYsS0FBSztnQkFJTixzQkFBc0I7c0JBRHJCLEtBQUs7Z0JBSU4seUJBQXlCO3NCQUR4QixLQUFLO2dCQUlOLDBCQUEwQjtzQkFEekIsS0FBSztnQkFJRyxRQUFRO3NCQURoQixNQUFNO2dCQUlFLE9BQU87c0JBRGYsTUFBTTtnQkFJRSxNQUFNO3NCQURkLE1BQU07Z0JBSUUsUUFBUTtzQkFEaEIsTUFBTTtnQkFJRSxTQUFTO3NCQURqQixNQUFNO2dCQUlFLFNBQVM7c0JBRGpCLE1BQU07Z0JBSUUsV0FBVztzQkFEbkIsTUFBTTtnQkFJUCxTQUFTO3NCQURSLFdBQVc7dUJBQUUsZ0JBQWdCO2dCQWMxQixZQUFZO3NCQURmLEtBQUs7Z0JBZ0JGLGdCQUFnQjtzQkFEbkIsS0FBSztnQkF3Qk4sV0FBVztzQkFEVixZQUFZO3VCQUFFLFdBQVcsRUFBRSxDQUFFLFFBQVEsQ0FBRTtnQkF1RHhDLFNBQVM7c0JBRFIsWUFBWTt1QkFBRSxTQUFTLEVBQUUsQ0FBRSxRQUFRLENBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBjYWxjdWxhdGVEcmFnSW1hZ2VPZmZzZXQsIERuZERyYWdJbWFnZU9mZnNldEZ1bmN0aW9uLCBEbmRFdmVudCwgc2V0RHJhZ0RhdGEsIHNldERyYWdJbWFnZSB9IGZyb20gXCIuL2RuZC11dGlsc1wiO1xuaW1wb3J0IHsgRG5kSGFuZGxlRGlyZWN0aXZlIH0gZnJvbSBcIi4vZG5kLWhhbmRsZS5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IGRuZFN0YXRlLCBlbmREcmFnLCBzdGFydERyYWcgfSBmcm9tIFwiLi9kbmQtc3RhdGVcIjtcbmltcG9ydCB7IEVmZmVjdEFsbG93ZWQgfSBmcm9tIFwiLi9kbmQtdHlwZXNcIjtcblxuQERpcmVjdGl2ZSgge1xuICBzZWxlY3RvcjogXCJbZG5kRHJhZ0ltYWdlUmVmXVwiXG59IClcbmV4cG9ydCBjbGFzcyBEbmREcmFnSW1hZ2VSZWZEaXJlY3RpdmUge1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBEbmREcmFnZ2FibGVEaXJlY3RpdmUpKSBwYXJlbnQ6IERuZERyYWdnYWJsZURpcmVjdGl2ZSwgZWxlbWVudFJlZjpFbGVtZW50UmVmICkge1xuICAgIHBhcmVudC5yZWdpc3RlckRyYWdJbWFnZSggZWxlbWVudFJlZiApO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoIHtcbiAgc2VsZWN0b3I6IFwiW2RuZERyYWdnYWJsZV1cIlxufSApXG5leHBvcnQgY2xhc3MgRG5kRHJhZ2dhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcblxuICBASW5wdXQoKVxuICBkbmREcmFnZ2FibGU6YW55O1xuXG4gIEBJbnB1dCgpXG4gIGRuZEVmZmVjdEFsbG93ZWQ6RWZmZWN0QWxsb3dlZCA9IFwiY29weVwiO1xuXG4gIEBJbnB1dCgpXG4gIGRuZFR5cGU/OnN0cmluZztcblxuICBASW5wdXQoKVxuICBkbmREcmFnZ2luZ0NsYXNzID0gXCJkbmREcmFnZ2luZ1wiO1xuXG4gIEBJbnB1dCgpXG4gIGRuZERyYWdnaW5nU291cmNlQ2xhc3MgPSBcImRuZERyYWdnaW5nU291cmNlXCI7XG5cbiAgQElucHV0KClcbiAgZG5kRHJhZ2dhYmxlRGlzYWJsZWRDbGFzcyA9IFwiZG5kRHJhZ2dhYmxlRGlzYWJsZWRcIjtcblxuICBASW5wdXQoKVxuICBkbmREcmFnSW1hZ2VPZmZzZXRGdW5jdGlvbjpEbmREcmFnSW1hZ2VPZmZzZXRGdW5jdGlvbiA9IGNhbGN1bGF0ZURyYWdJbWFnZU9mZnNldDtcblxuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgZG5kU3RhcnQ6RXZlbnRFbWl0dGVyPERyYWdFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgZG5kRHJhZzpFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBkbmRFbmQ6RXZlbnRFbWl0dGVyPERyYWdFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgZG5kTW92ZWQ6RXZlbnRFbWl0dGVyPERyYWdFdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdFdmVudD4oKTtcblxuICBAT3V0cHV0KClcbiAgcmVhZG9ubHkgZG5kQ29waWVkOkV2ZW50RW1pdHRlcjxEcmFnRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxEcmFnRXZlbnQ+KCk7XG5cbiAgQE91dHB1dCgpXG4gIHJlYWRvbmx5IGRuZExpbmtlZDpFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PigpO1xuXG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBkbmRDYW5jZWxlZDpFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PigpO1xuXG4gIEBIb3N0QmluZGluZyggXCJhdHRyLmRyYWdnYWJsZVwiIClcbiAgZHJhZ2dhYmxlID0gdHJ1ZTtcblxuICBwcml2YXRlIGRuZEhhbmRsZT86RG5kSGFuZGxlRGlyZWN0aXZlO1xuXG4gIHByaXZhdGUgZG5kRHJhZ0ltYWdlRWxlbWVudFJlZj86RWxlbWVudFJlZjtcblxuICBwcml2YXRlIGRyYWdJbWFnZTpFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gIHByaXZhdGUgaXNEcmFnU3RhcnRlZDpib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkcmFnRXZlbnRIYW5kbGVyOiggZXZlbnQ6RHJhZ0V2ZW50ICkgPT4gdm9pZCA9ICggZXZlbnQ6RHJhZ0V2ZW50ICkgPT4gdGhpcy5vbkRyYWcoIGV2ZW50ICk7XG5cbiAgQElucHV0KClcbiAgc2V0IGRuZERpc2FibGVJZiggdmFsdWU6Ym9vbGVhbiApIHtcblxuICAgIHRoaXMuZHJhZ2dhYmxlID0gIXZhbHVlO1xuXG4gICAgaWYoIHRoaXMuZHJhZ2dhYmxlICkge1xuXG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5kbmREcmFnZ2FibGVEaXNhYmxlZENsYXNzICk7XG4gICAgfVxuICAgIGVsc2Uge1xuXG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5kbmREcmFnZ2FibGVEaXNhYmxlZENsYXNzICk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGRuZERpc2FibGVEcmFnSWYoIHZhbHVlOmJvb2xlYW4gKSB7XG4gICAgdGhpcy5kbmREaXNhYmxlSWYgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCBwcml2YXRlIGVsZW1lbnRSZWY6RWxlbWVudFJlZixcbiAgICAgICAgICAgICAgIHByaXZhdGUgcmVuZGVyZXI6UmVuZGVyZXIyLFxuICAgICAgICAgICAgICAgcHJpdmF0ZSBuZ1pvbmU6Tmdab25lICkge1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6dm9pZCB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoICgpID0+IHtcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiZHJhZ1wiLCB0aGlzLmRyYWdFdmVudEhhbmRsZXIgKTtcbiAgICB9ICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOnZvaWQge1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoIFwiZHJhZ1wiLCB0aGlzLmRyYWdFdmVudEhhbmRsZXIgKTtcbiAgICBpZih0aGlzLmlzRHJhZ1N0YXJ0ZWQgPT09IHRydWUpIHtcbiAgICAgIGVuZERyYWcoKVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoIFwiZHJhZ3N0YXJ0XCIsIFsgXCIkZXZlbnRcIiBdIClcbiAgb25EcmFnU3RhcnQoIGV2ZW50OkRuZEV2ZW50ICk6IGJvb2xlYW4ge1xuXG4gICAgaWYoIHRoaXMuZHJhZ2dhYmxlID09PSBmYWxzZSApIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHRoZXJlIGlzIGRuZCBoYW5kbGUgYW5kIGlmIHRoZSBkbmQgaGFuZGxlIHdhcyB1c2VkIHRvIHN0YXJ0IHRoZSBkcmFnXG4gICAgaWYoIHR5cGVvZiB0aGlzLmRuZEhhbmRsZSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgJiYgdHlwZW9mIGV2ZW50Ll9kbmRVc2luZ0hhbmRsZSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGluaXRpYWxpemUgZ2xvYmFsIHN0YXRlXG4gICAgc3RhcnREcmFnKCBldmVudCwgdGhpcy5kbmRFZmZlY3RBbGxvd2VkLCB0aGlzLmRuZFR5cGUgKTtcblxuICAgIHRoaXMuaXNEcmFnU3RhcnRlZCA9IHRydWU7XG5cbiAgICBzZXREcmFnRGF0YSggZXZlbnQsIHtkYXRhOiB0aGlzLmRuZERyYWdnYWJsZSwgdHlwZTogdGhpcy5kbmRUeXBlfSwgZG5kU3RhdGUuZWZmZWN0QWxsb3dlZCEgKTtcblxuICAgIHRoaXMuZHJhZ0ltYWdlID0gdGhpcy5kZXRlcm1pbmVEcmFnSW1hZ2UoKTtcblxuICAgIC8vIHNldCBkcmFnZ2luZyBjc3MgY2xhc3MgcHJpb3IgdG8gc2V0RHJhZ0ltYWdlIHNvIHN0eWxlcyBhcmUgYXBwbGllZCBiZWZvcmVcbiAgICAvLyBUT0RPIGJyZWFraW5nIGNoYW5nZTogYWRkIGNsYXNzIHRvIGVsZW1lbnRSZWYgcmF0aGVyIHRoYW4gZHJhZyBpbWFnZSB3aGljaCBjb3VsZCBiZSBhbm90aGVyIGVsZW1lbnRcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKCB0aGlzLmRyYWdJbWFnZSwgdGhpcy5kbmREcmFnZ2luZ0NsYXNzICk7XG5cbiAgICAvLyBzZXQgY3VzdG9tIGRyYWdpbWFnZSBpZiBwcmVzZW50XG4gICAgLy8gc2V0IGRyYWdpbWFnZSBpZiBkcmFnIGlzIHN0YXJ0ZWQgZnJvbSBkbmRIYW5kbGVcbiAgICBpZiggdHlwZW9mIHRoaXMuZG5kRHJhZ0ltYWdlRWxlbWVudFJlZiAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgfHwgdHlwZW9mIGV2ZW50Ll9kbmRVc2luZ0hhbmRsZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblxuICAgICAgc2V0RHJhZ0ltYWdlKCBldmVudCwgdGhpcy5kcmFnSW1hZ2UsIHRoaXMuZG5kRHJhZ0ltYWdlT2Zmc2V0RnVuY3Rpb24gKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgZHJhZ2dpbmcgc291cmNlIGNzcyBjbGFzcyBvbiBmaXJzdCBkcmFnIGV2ZW50XG4gICAgY29uc3QgdW5yZWdpc3RlciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgXCJkcmFnXCIsICgpID0+IHtcblxuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyggdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZG5kRHJhZ2dpbmdTb3VyY2VDbGFzcyApO1xuICAgICAgdW5yZWdpc3RlcigpO1xuICAgIH0gKTtcblxuICAgIHRoaXMuZG5kU3RhcnQuZW1pdCggZXZlbnQgKTtcblxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgb25EcmFnKCBldmVudDpEcmFnRXZlbnQgKSB7XG5cbiAgICB0aGlzLmRuZERyYWcuZW1pdCggZXZlbnQgKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoIFwiZHJhZ2VuZFwiLCBbIFwiJGV2ZW50XCIgXSApXG4gIG9uRHJhZ0VuZCggZXZlbnQ6RHJhZ0V2ZW50ICkge1xuXG4gICAgLy8gZ2V0IGRyb3AgZWZmZWN0IGZyb20gY3VzdG9tIHN0b3JlZCBzdGF0ZSBhcyBpdHMgbm90IHJlbGlhYmxlIGFjcm9zcyBicm93c2Vyc1xuICAgIGNvbnN0IGRyb3BFZmZlY3QgPSBkbmRTdGF0ZS5kcm9wRWZmZWN0O1xuXG4gICAgbGV0IGRyb3BFZmZlY3RFbWl0dGVyOkV2ZW50RW1pdHRlcjxEcmFnRXZlbnQ+O1xuXG4gICAgc3dpdGNoKCBkcm9wRWZmZWN0ICkge1xuXG4gICAgICBjYXNlIFwiY29weVwiOlxuICAgICAgICBkcm9wRWZmZWN0RW1pdHRlciA9IHRoaXMuZG5kQ29waWVkO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBcImxpbmtcIjpcbiAgICAgICAgZHJvcEVmZmVjdEVtaXR0ZXIgPSB0aGlzLmRuZExpbmtlZDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJtb3ZlXCI6XG4gICAgICAgIGRyb3BFZmZlY3RFbWl0dGVyID0gdGhpcy5kbmRNb3ZlZDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRyb3BFZmZlY3RFbWl0dGVyID0gdGhpcy5kbmRDYW5jZWxlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZHJvcEVmZmVjdEVtaXR0ZXIuZW1pdCggZXZlbnQgKTtcbiAgICB0aGlzLmRuZEVuZC5lbWl0KCBldmVudCApO1xuXG4gICAgLy8gcmVzZXQgZ2xvYmFsIHN0YXRlXG4gICAgZW5kRHJhZygpO1xuXG4gICAgdGhpcy5pc0RyYWdTdGFydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKCB0aGlzLmRyYWdJbWFnZSwgdGhpcy5kbmREcmFnZ2luZ0NsYXNzICk7XG5cbiAgICAvLyBJRTkgc3BlY2lhbCBoYW1tZXJpbmdcbiAgICB3aW5kb3cuc2V0VGltZW91dCggKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyggdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZG5kRHJhZ2dpbmdTb3VyY2VDbGFzcyApO1xuICAgIH0sIDAgKTtcblxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgcmVnaXN0ZXJEcmFnSGFuZGxlKCBoYW5kbGU6RG5kSGFuZGxlRGlyZWN0aXZlIHwgdW5kZWZpbmVkICkge1xuXG4gICAgdGhpcy5kbmRIYW5kbGUgPSBoYW5kbGU7XG4gIH1cblxuICByZWdpc3RlckRyYWdJbWFnZSggZWxlbWVudFJlZjpFbGVtZW50UmVmIHwgdW5kZWZpbmVkICkge1xuXG4gICAgdGhpcy5kbmREcmFnSW1hZ2VFbGVtZW50UmVmID0gZWxlbWVudFJlZjtcbiAgfVxuXG4gIHByaXZhdGUgZGV0ZXJtaW5lRHJhZ0ltYWdlKCk6RWxlbWVudCB7XG5cbiAgICAvLyBldmFsdWF0ZSBjdXN0b20gZHJhZyBpbWFnZSBleGlzdGVuY2VcbiAgICBpZiggdHlwZW9mIHRoaXMuZG5kRHJhZ0ltYWdlRWxlbWVudFJlZiAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblxuICAgICAgcmV0dXJuIHRoaXMuZG5kRHJhZ0ltYWdlRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEVsZW1lbnQ7XG4gICAgfVxuICAgIGVsc2Uge1xuXG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuICB9XG59XG4iXX0=