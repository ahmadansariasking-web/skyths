CREATE OR REPLACE FUNCTION public.get_order_tracking(_order_number text)
RETURNS TABLE(order_number text, status text, tracking_note text, items jsonb, subtotal numeric, shipping numeric, total numeric, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT o.order_number, o.status, o.tracking_note, o.items,
         o.subtotal, o.shipping, o.total, o.created_at, o.updated_at
  FROM public.orders o
  WHERE upper(o.order_number) = upper(trim(_order_number))
  LIMIT 1;
$function$;